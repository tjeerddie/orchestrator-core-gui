import { EuiButton } from "@elastic/eui";
import UserInputFormWizard from "components/inputForms/UserInputFormWizard";
import { JSONSchema6 } from "json-schema";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ApplicationContext from "utils/ApplicationContext";
import { EngineStatus, Form, FormNotCompleteResponse } from "utils/types";
import { isEmpty } from "utils/Utils";
import { TARGET_CREATE } from "validations/Products";

import { setFlash } from "../../../utils/Flash";

interface IProps {
    preselectedInput?: any;
    formKey: string;
}

export default function CreateForm(props: IProps) {
    const intl = useIntl();
    const { preselectedInput, formKey } = props;
    const { products, redirect, customApiClient } = useContext(ApplicationContext);
    const [form, setForm] = useState<Form>({});
    const { stepUserInput, hasNext } = form;

    const submit = useCallback(
        (userInputs: any[]) => {
            // if (preselectedInput.product) {
            // Todo: decide if we want to implement pre-selections and design a way to do it generic
            //     userInputs = [{ preselectedInput }, ...processInput];
            // }
            let promise = customApiClient.startForm(formKey, userInputs).then(
                (form) => {
                    // Todo: handle ticket output and call the endpoint to save the ticket
                    console.log("Posted form inputs", form);
                    setFlash(
                        intl.formatMessage(
                            { id: "forms.flash.create_create" }
                            // { name: product.name, pid: process.id }
                        )
                    );
                },
                (e) => {
                    throw e;
                }
            );

            // Todo: fix type
            return customApiClient.catchErrorStatus<EngineStatus>(promise, 503, (json) => {
                setFlash(
                    intl.formatMessage({ id: `settings.status.engine.${json.global_status.toLowerCase()}` }),
                    "error"
                );
                redirect("/tickets");
            });
        },
        [redirect, preselectedInput, intl, customApiClient]
    );

    useEffect(() => {
        if (formKey) {
            customApiClient.catchErrorStatus<FormNotCompleteResponse>(submit([]), 510, (json) => {
                setForm({
                    stepUserInput: json.form,
                    hasNext: json.hasNext ?? false,
                });
            });
        }
    }, [formKey, products, submit, preselectedInput, intl, customApiClient]);

    return (
        <div>
            {stepUserInput && (
                <UserInputFormWizard
                    stepUserInput={stepUserInput}
                    validSubmit={submit}
                    cancel={() => redirect("/tickets")}
                    hasNext={hasNext ?? false}
                />
            )}
        </div>
    );
}
