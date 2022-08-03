import React, { FC } from "react";
import Link from "next/link";

export const Entry: FC<Props> = ({ id, name, author }) => (
    <li>
        <Link href={id}>
            <a className="font-semibold text-gray-800 hover:text-blue-400 flex">
                <span className="flex-shrink-0">{id} {name}</span>

                <span className="flex-grow overflow-hidden ">{".".repeat(500)}</span>
                <span className="flex-shrink-0">{author}</span>
            </a>
        </Link>
    </li>
);

export const Contents: FC<{}> = () => {
    return (
        <div>
            <h1 className="text-left font-bold text-xl my-2">Shabbat Evening</h1>
            <ul>
                <Entry id="1a" name="Y'did Nefesh" author="Pursa" />
                <Entry id="1b" name="Y'did Nefesh" author="Yitzchok Alster" />
                <Entry id="1c" name="Y'did Nefesh" author="Ehud/Sara Zweig" />
                <Entry id="1d" name="Y'did Nefesh" author="Abie Rotenberg" />
                <Entry id="6a" name="Moshe V'Aharon" author="Shlomo Carlebach" />
                <Entry id="7a" name="Havu Ladonai" author="Michele Bolaffi" />
                <Entry id="10a" name="Tzadik Katamar" author="Louis Lewandowski" />
                <Entry id="11a" name="Eidotecha" author="Trad." />
                <Entry id="15b" name="Ki Heim Chayeinu" author="Yigal Calek" />
                <Entry id="18a" name="V'shamru" author="Louis Lewandowski" />
                <Entry id="18b" name="V'shamru" author="Shlomo Carlebach" />
                <Entry id="18c" name="V'shamru" author="Charles Lowy" />
                <Entry id="25a" name="Bayom Hahu" author="Haim Wasserzug" />
            </ul>
            <h1 className="text-left font-bold text-xl mt-8 mb-2">Shabbat Day</h1>
            <ul>
                <Entry id="201a" name="Ein Kamocha" author="Salomon Sulzer" />
                <Entry id="202b" name="Av Harachamim" author="Abraham Dunajewsky" />
                <Entry id="203a" name="Vay'hi Binsoa" author="Salomon Sulzer" />
                <Entry id="203b" name="Vay'hi Binsoa" author="Julius Mombach" />
                <Entry id="203c" name="Vay'hi Binsoa" author="Samuel Naumbourg" />
                <Entry id="203d" name="Vay'hi Binsoa" author="Louis Lewandowski" />
                <Entry id="203e" name="Vay'hi Binsoa" author="Haim Wasserzug" />
                <Entry id="203f" name="Vay'hi Binsoa" author="Abraham Saqui" />
                <Entry id="203g" name="Vay'hi Binsoa" author="Marcus Hast" />
                <Entry id="203h" name="Vay'hi Binsoa" author="Emile Jonas" />
                <Entry id="205a" name="Shema Yisrael" author="Louis Lewandowski" />
                <Entry id="206a" name="L'cha Adonai" author="Louis Lewandowski" />
                <Entry id="206c" name="L'cha Adonai" author="Gershon Ephros" />
                <Entry id="208a" name="V'zot Hatorah" author="Louis Lewandowski" />
                <Entry id="212a" name="Rofei Elyohn" author="Paul Zim" />
                <Entry id="213b" name="Mi She'asa Nisim" author="Stephen Levey" />
                <Entry id="217a" name="Ashrei" author="Salomon Sulzer" />
                <Entry id="218a" name="Va'anachnu" author="Felix Mendelssohn" />
                <Entry id="219a" name="Hodo Al Eretz" author="Julius Mombach" />
                <Entry id="220a" name="Havu Ladonai" author="Julius Mombach" />
                <Entry id="221a" name="Eitz Chayim" author="Nissan Blumenthal" />
                <Entry id="221b" name="Eitz Chayim" author="Tanchum Portnoy" />
                <Entry id="221c" name="Uv'nucho Yomar" author="Louis Lewandowski" />
                <Entry id="221d" name="Hashiveinu" author="Samuel Malavsky" />
                <Entry id="221e" name="Eitz Chayim" author="Samuel Naumbourg" />
                <Entry id="221f" name="Ba'avur David" author="David Roitman" />
                <Entry id="221g" name="Uv'nucho Yomar" author="Yossele Rosenblatt" />
                <Entry id="221h" name="Ki Lekach Tov" author="Abie Rotenberg" />
                <Entry id="221i" name="Ki Lekach Tov" author="Julius Mombach" />
                <Entry id="221j" name="Ki Lekach Tov" author="Jack Rosenberg" />
                <Entry id="221m" name="Eitz Chayim" author="Salomon Sulzer" />
                <Entry id="235a" name="Ein Keloheinu" author="Julius Freudenthal" />
                <Entry id="235b" name="Ein Keloheinu" author="Abraham Saqui" />
                <Entry id="235c" name="Ein Keloheinu" author="Shlomo Carlebach" />
                <Entry id="235e" name="Ein Keloheinu" author="Trad." />
                <Entry id="235f" name="Ein Keloheinu" author="George Handel" />
                <Entry id="235g" name="Ein Keloheinu" author="Marcus Hast" />
                <Entry id="237d" name="Adon Olam" author="Simon Waley" />
            </ul>
        </div>
    );
}

interface Props {
    id: string;
    name: string;
    author: string;
}