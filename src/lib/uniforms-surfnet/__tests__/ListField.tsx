/*
 * Copyright 2019-2020 SURF.
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

import { ListAddField, ListField, ListItemField } from "../src";
import createContext from "./_createContext";
import mount from "./_mount";

test("<ListField> - works", () => {
    const element = <ListField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find(ListField)).toHaveLength(1);
});

test("<ListField> - renders ListAddField", () => {
    const element = <ListField name="x" label="ListFieldLabel" />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find(ListAddField)).toHaveLength(1);
    expect(wrapper.find(ListAddField).prop("name")).toBe("$");
});

test("<ListField> - renders correct label (specified)", () => {
    const element = <ListField name="x" label="ListFieldLabel" />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find("label")).toHaveLength(3);
    expect(
        wrapper
            .find("label")
            .at(0)
            .text()
    ).toEqual(expect.stringContaining("ListFieldLabel"));
});

test("<ListField> - renders correct numer of items with initialCount (specified)", () => {
    const element = <ListField name="x" initialCount={3} />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find("input")).toHaveLength(3);
});

test("<ListField> - passes itemProps to its children", () => {
    const element = <ListField name="x" initialCount={3} itemProps={{ "data-xyz": 1 }} />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(
        wrapper
            .find(ListItemField)
            .first()
            .prop("data-xyz")
    ).toBe(1);
});

test("<ListField> - renders children (specified)", () => {
    const Child = jest.fn(() => <div />) as React.FC<any>;

    const element = (
        <ListField name="x" initialCount={2}>
            <Child />
            PlainText
        </ListField>
    );
    mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(Child).toHaveBeenCalledTimes(2);
});

test("<ListField> - renders children with correct name (children)", () => {
    const Child = jest.fn(() => <div />) as React.FC<any>;

    const element = (
        <ListField name="x" initialCount={2}>
            <Child name="$" />
        </ListField>
    );
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(
        wrapper
            .find(Child)
            .at(0)
            .prop("name")
    ).toBe("0");
    expect(
        wrapper
            .find(Child)
            .at(1)
            .prop("name")
    ).toBe("1");
});

test("<ListField> - renders children with correct name (value)", () => {
    const element = <ListField name="x" initialCount={2} />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(
        wrapper
            .find(ListItemField)
            .at(0)
            .prop("name")
    ).toBe("0");
    expect(
        wrapper
            .find(ListItemField)
            .at(1)
            .prop("name")
    ).toBe("1");
});

test("<ListField> - renders correctly when child is list", () => {
    const element = <ListField name="x" />;
    const wrapper = mount(
        element,
        createContext(
            { x: { type: Array }, "x.$": { type: Array }, "x.$.$": { type: String } },
            { model: { x: [["test"]] } }
        )
    );

    expect(wrapper.find(ListItemField)).toHaveLength(2);
    expect(
        wrapper
            .find(ListItemField)
            .at(0)
            .prop("outerList")
    ).toBe(true);
    expect(
        wrapper
            .find(ListItemField)
            .at(1)
            .prop("outerList")
    ).toBe(false);
    expect(wrapper.find(ListAddField)).toHaveLength(2);
    expect(
        wrapper
            .find(ListAddField)
            .at(0)
            .prop("outerList")
    ).toBe(false);
    expect(
        wrapper
            .find(ListAddField)
            .at(1)
            .prop("outerList")
    ).toBe(true);

    expect(wrapper.find("ul")).toHaveLength(2);
    expect(
        wrapper
            .find("ul")
            .at(0)
            .prop("className")
    ).toContain("outer-list");
    expect(
        wrapper
            .find("ul")
            .at(1)
            .prop("className")
    ).toBe("list-field");
});
