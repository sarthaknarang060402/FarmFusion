import React from 'react';

const HtmlRenderer = ({ htmlCode }) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlCode }} />;
};

export default HtmlRenderer;