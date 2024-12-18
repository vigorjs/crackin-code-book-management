import { HTMLAttributes } from "react";

export default function ApplicationLogo(props: HTMLAttributes<HTMLElement>) {
    return (
        <img
            className={props.className}
            src={`/favicon.png`}
            alt="Application Logo"
        ></img>
    );
}
