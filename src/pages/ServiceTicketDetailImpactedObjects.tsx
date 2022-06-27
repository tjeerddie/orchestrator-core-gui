/*
 * Copyright 2019-2022 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { EuiFlexGroup } from "@elastic/eui";
import React from "react";
import { FormattedMessage, WrappedComponentProps, injectIntl } from "react-intl";
import ApplicationContext from "utils/ApplicationContext";
import { ServiceTicketImpactedObjectImpact, ServiceTicketWithDetails, SortOption } from "utils/types";
import { stop } from "utils/Utils";

import { tableImpactedObjects } from "./ServiceTicketDetailImpactedObjectsStyling";

type Column = "customer" | "impact" | "type" | "subscription" | "impact_override";

interface IProps extends WrappedComponentProps {
    ticket: ServiceTicketWithDetails;
    modalFunc: Function;
}

export interface ImpactedService {
    customer: string;
    impact: ServiceTicketImpactedObjectImpact;
    type: string;
    subscription: string;
    impact_override?: ServiceTicketImpactedObjectImpact;
    subscription_id: string;
    ims_circuit_id: number;
    ims_circuit_name: string;
    extra_information?: string;
}

interface IState {
    impactedServices: ImpactedService[];
    sortOrder: SortOption<Column>;
}

class ServiceTicketDetailImpactedObjects extends React.Component<IProps, IState> {
    context!: React.ContextType<typeof ApplicationContext>;
    state: IState = {
        impactedServices: [],
        sortOrder: { name: "subscription", descending: false },
    };

    /**
     * Loops through impacted objects in the serviceticket, then through circuits in each impacted object.
     * Information of each circuit is then wrapper in a ImpactedService along with information of the
     * corresponding impacted object and subcription.
     */
    async getImpactedServices(): Promise<ImpactedService[]> {
        // TODO how to specify here that the values are of type SubscriptionModel ?
        const subscriptions: any = {};

        // Retrieve each subscription once
        for (const impacted of this.props.ticket.impacted_objects) {
            if (impacted.subscription_id in subscriptions) {
                continue;
            }
            subscriptions[impacted.subscription_id] = await this.context.apiClient.subscriptionsDetailWithModel(
                impacted.subscription_id
            );
        }
        const impactedServices: ImpactedService[] = [];
        for (const impactedObject of this.props.ticket.impacted_objects) {
            const subscription = subscriptions[impactedObject.subscription_id];
            for (const imsCircuit of impactedObject.ims_circuits) {
                impactedServices.push({
                    customer: impactedObject.owner_customer.customer_name,
                    impact: imsCircuit.impact,
                    type: subscription.product.product_type,
                    subscription: subscription.description,
                    impact_override: imsCircuit.impact_override,
                    subscription_id: impactedObject.subscription_id,
                    ims_circuit_id: imsCircuit.ims_circuit_id,
                    ims_circuit_name: imsCircuit.ims_circuit_name,
                    extra_information: imsCircuit.extra_information,
                });
            }
        }
        return impactedServices;
    }

    async componentDidMount() {
        this.setState({ impactedServices: await this.getImpactedServices() });
    }

    async componentDidUpdate(prevProps: IProps) {
        if (this.props.ticket.last_update_time !== prevProps.ticket.last_update_time) {
            this.setState({ impactedServices: await this.getImpactedServices() });
        }
    }

    sortBy = (name: Column) => (a: ImpactedService, b: ImpactedService) => {
        const aSafe = a[name] || "";
        const bSafe = b[name] || "";
        return typeof aSafe === "string" || typeof bSafe === "string"
            ? (aSafe as string).toLowerCase().localeCompare(bSafe.toString().toLowerCase())
            : aSafe - bSafe;
    };

    toggleSort = (name: Column) => (e: React.MouseEvent<HTMLTableHeaderCellElement>) => {
        stop(e);
        const sortOrder = { ...this.state.sortOrder };
        sortOrder.descending = sortOrder.name === name ? !sortOrder.descending : false;
        sortOrder.name = name;
        this.setState({ sortOrder: sortOrder });
    };

    sort = (unsorted: ImpactedService[]) => {
        const { name, descending } = this.state.sortOrder;
        const sorted = unsorted.sort(this.sortBy(name));
        if (descending) {
            sorted.reverse();
        }
        return sorted;
    };

    sortColumnIcon = (name: string, sorted: SortOption) => {
        if (sorted.name === name) {
            return <i className={sorted.descending ? "fas fa-sort-down" : "fas fa-sort-up"} />;
        }
        return <i />;
    };

    render() {
        const columns: Column[] = ["customer", "impact", "type", "subscription", "impact_override"];
        const { theme } = this.context;
        const { impactedServices } = this.state;

        const th = (index: number) => {
            const name = columns[index];
            return (
                <th key={index} className={name} onClick={this.toggleSort(name)}>
                    <span>
                        <FormattedMessage id={`tickets.impactedobject.${name}`} />
                    </span>
                    {this.sortColumnIcon(name, this.state.sortOrder)}
                </th>
            );
        };
        const sortedImpactedServices = this.sort(impactedServices);
        return (
            <EuiFlexGroup css={tableImpactedObjects}>
                {/* <EuiToolTip
                    position="top"
                    content={<p>Works on any kind of element &mdash; buttons, inputs, you name it!</p>}
                > */}
                <table className="impactedObjects">
                    <thead>
                        <tr>{columns.map((column, index) => th(index))}</tr>
                    </thead>
                    <tbody>
                        {sortedImpactedServices.map((service) => (
                            <tr
                                key={`${service.subscription_id}-${service.ims_circuit_id}`}
                                className={theme}
                                onClick={() => this.props.modalFunc(service)}
                            >
                                <td className="customer">{service.customer}</td>
                                <td className="impact">{service.impact}</td>
                                <td className="type">{service.type}</td>
                                <td className="subscription">{service.subscription}</td>
                                <td className="impact_override">{service.impact_override}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* </EuiToolTip> */}
            </EuiFlexGroup>
        );
    }
}
ServiceTicketDetailImpactedObjects.contextType = ApplicationContext;

export default injectIntl(ServiceTicketDetailImpactedObjects);
