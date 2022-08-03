import React, { FC } from "react";
import Link from "next/link";

export const Entry: FC<Props> = ({id, name, author}) => (
    <li className="flex gap-1" >
        <Link href={id}>
            <a className="font-semibold text-blue-600 hover:text-blue-800  flex-shrink-0">{name}</a>
        </Link>
        <span className="flex-grow overflow-hidden">{".".repeat(500)}</span>
        <span className="flex-shrink-0">{author}</span>
    </li>
);

export const Contents: FC<{}> = () => {
    return (
        <ul>
            <Entry id="206a" name="L'cha Adonai" author="Louis Lewandowski" />
        </ul>
    );
}

interface Props {
    id: string;
    name: string;
    author: string;
}