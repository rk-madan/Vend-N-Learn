import React, { useState } from 'react';

const ImageComponent = ({ src, alt, ...props }) => {
    const [error, setError] = useState(false);

    // Fallback placeholder
    const fallback = "https://via.placeholder.com/300?text=No+Image";

    return (
        <img
            src={error ? fallback : src}
            alt={alt}
            onError={() => setError(true)}
            {...props}
        />
    );
};

export default ImageComponent;
