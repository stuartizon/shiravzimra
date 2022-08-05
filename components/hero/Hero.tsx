import * as React from "react";
import styles from "./Hero.module.css";

const Hero: React.FC<Props> = ({ children }) => {
    return (
        // <div className={`${styles.hero} h-screen bg-cover nbg-fixed bg-blend-darken bg-black bg-opacity-50 flex flex-col items-center text-center justify-center`}>
        <div className={`${styles.hero} h-screen w-screen bg-cover flex flex-col items-center text-center justify-center text-neutral-600`}>
            {children}
        </div>
    );
}

interface Props {
    children: React.ReactNode;
}

export default Hero;