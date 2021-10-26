import { NextPage } from "next";
import { useSpring, animated } from 'react-spring';
import useMeasure from 'react-use-measure';
// import { useRef } from "react";


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
        "bg-nci-yellow",
        "bg-nci-red",
        "bg-nci-cyan",
        "bg-nci-violet",
        "bg-nci-orange",
        "bg-nci-green",
        "bg-nci-gray",
        "bg-nci-blumine"
    ];

    const mockData = [
        60, 200, 150, 300, 75, 120, 130, 20
    ];

    const horizontalSpring = (data) => {
        return useSpring({
            to: { height: 50, width: data, borderRadius: 5 },
            from: { width: 50, height: 50, borderRadius: 5 }
        })
    };

    const verticalSpring = (data) => {
        return useSpring({
            from: { width: 50, height: 50, borderRadius: 5 },
            to: { height: data, width: 50, borderRadius: 5 },
        })
    };

    const innerCircle = useSpring({
        to: { height: 150, width: 150, borderRadius: 75 },
        from: { width: 10, height: 10, borderRadius: 5 }
    });

    const outerCircle = useSpring({
        to: { height: 250, width: 250, borderRadius: 125 },
        from: { width: 10, height: 10, borderRadius: 5 }
    });

    const partition = useSpring({
        // todo
        to: { height: 50, width: 50 },
        from: { width: 50, height: 50 }
    });
    

    return (
        <>
            <h1 className="m-5 font-medium">Bars</h1>
            <div className="flex flex-row">
            {mockData.map((element, i) => {
                return (
                    <animated.div className={`${colorList[i]} m-2 h-screen mt-auto`} ref={ref} style={verticalSpring(element)}></animated.div>
                )
            })}
            </div>
            <h1 className="m-5 font-medium">Rings</h1>
            <div className="flex flex-row">
                {colorList.map((color, i) => {
                    return i % 3 === 0 ?
                        (<>
                            <animated.div className={`${color} flex justify-center items-center m-5`} style={outerCircle}>
                                <animated.div className="bg-white flex justify-center items-center" style={innerCircle}><animated.div className="justify-center absolute">??%</animated.div></animated.div>
                            </animated.div>
                            
                        </>
                        ) : null
                })}
            </div>
            <div className="flex flex-row">
                {colorList.map((color, i) => {
                    return i % 3 === 1 ?
                        (
                            <animated.div className={`${color} flex justify-center items-center m-5`} style={outerCircle}>
                                <animated.div>
                                    <animated.div className="bg-white flex justify-center items-center" style={innerCircle}><animated.div className="justify-center">100%</animated.div></animated.div>
                                </animated.div>
                            </animated.div>

                        ) : null
                })}
            </div>
            <div className="flex flex-row">
                {colorList.map((color, i) => {
                    return i % 3 === 2 ?
                        (
                            <animated.div className={`${color} flex justify-center items-center m-5`} style={outerCircle}>
                                <animated.div>
                                    <animated.div className="bg-white flex justify-center items-center" style={innerCircle}><animated.div className="justify-center">100%</animated.div></animated.div>
                                </animated.div>
                            </animated.div>

                        ) : null
                })}
            </div>
        </>
    )
}

export default Bar;