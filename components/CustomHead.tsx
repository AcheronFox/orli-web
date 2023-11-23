import { NextPage } from "next";
import React from "react";
import Head from "next/head";

type Props = {
    title?: string
};

const CustomHead: NextPage<Props> = (props: Props) => {

    return (
        <Head>
            <title>{`${props.title? `${props.title} - ` : ''} Örli Försztivál 2024 Contact`}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
        </Head>
    );
};

export default CustomHead;