/*
 * Copyright 2019 SURF.
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

import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

import "./FixedInputProductValidation.scss";
import ApplicationContext from "../utils/ApplicationContext";

export default class FixedInputProductValidation extends React.Component {
    render() {
        const { validation } = this.props;
        return (
            <section className="fixed-input-validation">
                <h3 onClick={() => this.context.redirect("/product/" + validation.id)} className="description">
                    {I18n.t("validations.fixedInput.title", { name: validation.name })}
                </h3>
                <table>
                    <thead>
                        <tr>
                            <th className={"name"}>{I18n.t("validations.fixedInput.fixed_input_name")}</th>
                            <th className={"error"}>{I18n.t("validations.fixedInput.fixed_input_error")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validation.errors.map((error, index) => (
                            <tr key={index}>
                                <td>{error.name}</td>
                                <td>
                                    {I18n.t(`validations.fixedInput.error.${error.error}`, {
                                        value: error.value
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        );
    }
}

FixedInputProductValidation.propTypes = {
    validation: PropTypes.object.isRequired
};

FixedInputProductValidation.contextType = ApplicationContext;
