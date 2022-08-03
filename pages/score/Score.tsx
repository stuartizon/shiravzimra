import React, { useState } from "react";
import { Document, Page } from 'react-pdf';
import { useElementSize } from 'usehooks-ts';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Score = ({ file }: Props) => {
    const [ref, { width }] = useElementSize();
    const [numPages, setNumPages] = useState<number>(0);
    const onLoadSuccess = ({ numPages }: { numPages: number }) => setNumPages(numPages);

    return (
        <div ref={ref}>
            <Document file={{ url: file }} onLoadSuccess={onLoadSuccess}>
                {
                    Array.from(
                        new Array(numPages),
                        (_el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderMode="svg"
                                width={width - 32}
                                className="mx-4 my-4 md:my-16 shadow"
                            />
                        ),
                    )}
            </Document>
        </div>
    );
}

interface Props {
    file: string;
}

export default Score;