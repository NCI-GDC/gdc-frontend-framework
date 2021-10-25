import { NextPage } from "next";
import { useSpring, animated } from 'react-spring';
import { useRef } from "react";
import useMeasure from 'react-use-measure'


// interface BarProps {
//     readonly name: string;
//     readonly orientation: string;
//     readonly data: ReadonlyArray<Number>
// }

const Bar: NextPage = () => {
    const [ref, bounds] = useMeasure();

    const props = useSpring({
        to: { width: 500, height: 500 },
        from: { width: 50, height: 50 }
    });

    const colorList = [
        "bg-nci-yellow m-5",
        "bg-nci-red m-5",
        "bg-nci-cyan m-5",
        "bg-nci-violet m-5",
        "bg-nci-orange m-5",
        "bg-nci-green m-5"
    ];

    const mockData = [
        100, 500, 1000, 600, 75, 150, 200
    ]

    const generateSpring = (data) => {
        return useSpring({
            to: { height: 50, width: data, borderRadius: 5 },
            from: { width: 50, height: 50, borderRadius: 5 }
        })
    }

    return (
        <>
            <h1 className="m-5 font-medium">Bars</h1>
            {mockData.map((element, i) => {
                return (
                    <animated.div className={colorList[i]} ref={ref} style={generateSpring(element)}></animated.div>
                )
                })}
        </>
    )
}

export default Bar;