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

export interface Product {
    name: string;
    tag: string;
    description: string;
    product_id: string;
    created_at: number;
    product_type: string;
    end_date: number;
    status: string;
    fixed_inputs: FixedInput[];
}

export interface ProductWithDetails extends Product {
    workflows?: Workflow[];
}

export interface FixedInput {
    name: string;
    value: string;
}

export interface SubscriptionProcesses {
    pid: string;
    subscription_id: string;
    workflow_target: string;
    process: Process;
}

export interface SubscriptionInstance {
    subscription_instance_id: string;
    product_block: ProductBlock;
    label: string;
    values: InstanceValue[];
}

export interface InstanceValue {
    resource_type: ResourceType;
    value: string;
}

export interface ResourceType {
    resource_type: string;
}

export interface ProductBlock {
    name: string;
    tag: string;
}

export interface Subscription {
    subscription_id: string;
    description: string;
    product: Product;
    product_id: string;
    status: string;
    insync: boolean;
    customer_id: string;
    start_date: number;
    end_date: number;
    note: string;
}

export interface SubscriptionWithDetails extends Subscription {
    customer_name: string;
    instances: SubscriptionInstance[];
    end_date_epoch: number;
    start_date_epoch: number;

    // Used by enrich functions
    service_speed: string;
    nms_service_id_p: string;
    nms_service_id_s: string;
    label: string;
    ims_circuit_name: string;
    ims_node: string;
    ims_port: string;
    ims_iface_type: string;
    ims_patch_position: string;
    vlan: string;
}

export interface ServicePortSubscription extends Subscription {
    port_mode?: string;
    crm_port_id?: string;
}

export interface ServicePort {
    subscription_id: string | null;
    vlan: string;
    tag?: string;
    port_mode: string;
    bandwidth?: number;
    nonremovable?: boolean;
    modifiable?: boolean;
}

export interface Organization {
    uuid: string;
    name: string;
}

export interface ValidationError {
    input_type: string;
    loc: (string | number)[];
    msg: string;
    type: string;
    ctx?: ValidationErrorContext;
}

export interface ValidationErrorContext {
    [index: string]: string;
}

export interface FormNotCompleteResponse {
    form: InputField[];
    hasNext?: boolean;
}

export interface Process {
    pid: string;
    workflow: string;
    assignee: string;
    last_status: string;
    failed_reason: string;
    traceback: string;
    step: string;
    created_by: string;
    started_at: number;
    last_modified_at: number;
    is_task: boolean;
}

export interface ProcessWithDetails {
    id: string;
    workflow_name: string;
    product: string;
    customer: string;
    assignee: string;
    status: string;
    failed_reason: string;
    traceback: string;
    step: string;
    created_by: string;
    started: number;
    last_modified: number;
    is_task: boolean;
}

export interface ProcessWithDetails extends Process {
    steps: Step[];
}

export interface ProcessSubscription {
    id: string;
    pid: string;
    subscription_id: string;
    created_at: number;
    workflow_target: string;
}

export interface InputField {
    [index: string]: any;
}

export interface Step {
    name: string;
    executed: number;
    status: string;
    state: State;
    commit_hash: string;
    form?: InputField[];
}

export interface FilterAttribute {
    name: string;
    selected: boolean;
    count: number;
}

export interface State {
    [index: string]: any;
}

export interface ShowActions {
    show: boolean;
    id: string;
}

export interface SortSettings {
    name: string;
    descending: boolean;
}

export interface Option {
    value: string;
    label: string;
}

export interface Workflow {
    name: string;
    target: string;
}

export interface AppError extends Error {
    response?: Response;
}

export interface AppConfig {
    oauthEnabled: string;
    oauthAuthorizeUrl: string;
    clientId: string;
    scope: string[];
    redirectUri: string;
    NOC: string;
    CHANGES: string;
    KLANT_SUPPORT: string;
}

export interface User {
    user_name: string;
    displayName: string;
    sub: string;
}

export function typedKeys<T>(o: T): (keyof T)[] {
    // type cast should be safe because that's what really Object.keys() does
    return Object.keys(o) as (keyof T)[];
}

export function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

export function optionalProp<T>(obj: T, key: string): any | undefined {
    // @ts-ignore
    return obj[key];
}

export function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}
