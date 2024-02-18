/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import Button from "@/comp/button/Button";
import { NextPage } from "next";


const options: HTMLReactParserOptions = {
    replace(domNode) {
        if (domNode instanceof Element && domNode.attribs) {
            switch (domNode.name) {
                case ('button'):
                    return replaceDOMWithElement(domNode, Button, domNode.name)
            }
        }
    },
};

const replaceDOMWithElement = (DOM: Element, Element: NextPage, elementName: string) => {
    if (DOM.name == elementName) {
        const props = attributesToProps(DOM.attribs);

        if (DOM.children) {
            return (
                <Element {...props}>
                    {domToReact((DOM.children as DOMNode[]), options)}
                </Element>
            )
        }
        else {
            return <Element {...props} />
        }
    }
}



export const useHTMLString = () => {
    const parseString = (str: string) => {
        return parse(str, options)
    } 

    return parseString
}