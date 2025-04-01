import React, { ReactNode } from 'react';
import background from '../../assets/svg/background.svg'

interface StyledBackgroundProps {
  children?: ReactNode;
  className?: string;
}

const StyledBackground: React.FC<StyledBackgroundProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`${className}`}
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh'
            }}
            >
            {children}
        </div>

    );
};

export default StyledBackground;
