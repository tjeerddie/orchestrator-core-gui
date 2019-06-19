import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

import "react-select/dist/react-select.css";
import { transitions, productById, subscriptionsDetail } from "../api";

export default class TransitionProductSelect extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = { transitionProducts: [], subscription: {} };
    }

    componentDidMount = () => {
        const { subscriptionId, transitionType, newProductId } = this.props;
        this.filterProductFromState(subscriptionId, transitionType, newProductId);
    };

    filterProductFromState = (subscriptionId, transitionType, newProductId) => {
        subscriptionsDetail(subscriptionId).then(result => {
            if (result.product_id === newProductId) {
                transitions(subscriptionId, transitionType).then(result =>
                    this.setState({ transitionProducts: result })
                );
            } else {
                productById(newProductId).then(prod => {
                    transitions(subscriptionId, transitionType).then(result => {
                        result.map(res => {
                            if (prod.product_id === res.product_id) {
                                this.setState({ transitionProducts: [prod] });
                            }
                            return {};
                        });
                    });
                });
            }
        });
    };

    render() {
        const { onChange, product, disabled } = this.props;
        const { transitionProducts } = this.state;
        return (
            <Select
                onChange={onChange}
                options={transitionProducts.map(p => ({
                    value: p.product_id,
                    label: p.name
                }))}
                value={transitionProducts.length === 1 ? transitionProducts[0].product_id : product}
                searchable={false}
                placeholder="Search and select a product..."
                disabled={disabled || transitionProducts.length === 0 || transitionProducts.length === 1}
            />
        );
    }
}

TransitionProductSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    subscriptionId: PropTypes.string,
    product: PropTypes.string,
    transitionType: PropTypes.string,
    disabled: PropTypes.bool,
    newProductId: PropTypes.string
};
