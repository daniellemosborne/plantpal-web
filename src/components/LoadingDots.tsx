import React from "react"

type Props = {
    base?: string;
    steps?: number;
    interval?: number;
};

const LoadingDots: React.FC<Props> = ({ base = "Loading", steps = 3, interval = 400 }) => {
    const [count, setCount] = React.useState(1);

    React.useEffect(() => {
        const id = setInterval(() => {
            setCount((c) => (c % steps) + 1);
        }, interval);
        return () => clearInterval(id);
    }, [steps, interval]);
    return <span>{base}{'.'.repeat(count)}</span>;
};

export default LoadingDots;