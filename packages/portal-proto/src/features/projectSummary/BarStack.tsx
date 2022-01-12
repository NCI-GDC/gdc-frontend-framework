import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTransition, animated, useSpringRef, useSpring, Trail } from 'react-spring';
import { useMeasure } from "react-use";

const BarStack = ({ numFill, numSpace, color }) => {
    const [fill, setFill] = useState(1);
    const [space, setSpace] = useState(1);
    const [barColor, setBarColor] = useState(color);

    const getWidth = (partition) => {
        // use measure for width and account for edge cases close to 0.01 and 0.99 ratios
        if ((partition / (fill + space)) > 0.98) {
            return 0.98
        } else if ((partition / (fill + space)) < 0.02) {
            return 0.02
        } else {
            // console.log('partition width', (partition / (fill + space)), 'partition', partition);
            return (partition / (fill + space))
        }
    }

    const filled = useSpring({
        from: { width: 0, height: 15, backgroundColor: barColor, borderBottomLeftRadius: 5, borderTopLeftRadius: 5 },
        to: { width: 125 * getWidth(fill), height: 20, backgroundColor: barColor, borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }  // subtract a tiny amt from edge so divs dont take separate lines (ex. - width / 80)
    });
    const remaining = useSpring({
        from: { width: 0, height: 15, backgroundColor: "light" + barColor, borderBottomRightRadius: 5, borderTopRightRadius: 5 },
        to: { width: 125 * getWidth(space), height: 20, backgroundColor: "light" + barColor, borderBottomRightRadius: 5, borderTopRightRadius: 5 } // subtract a tiny amt from edge so divs dont take separate lines (ex. - width / 80)
    });

    // const full = useSpring({
    //     from: { width: 0, backgroundColor: "gray" },
    //     to: { width: 500, backgroundColor: "black" }
    // });
    const container = useSpring({
        from: { borderRadius: 5 },
        to: { borderRadius: 5 }
    });



    useEffect(() => {
        setFill(numFill);
        setSpace(numSpace);
    }, [numFill, numSpace]);


    return (
        <>
            {/* render 2 divs for most happy paths */}
            {/* add styling so divs are on same line */}
            <animated.div style={container} className={`flex flex-row`}>
                <animated.div>
                    <animated.div style={filled}></animated.div>
                </animated.div>
                <animated.div >
                    <animated.div style={remaining}></animated.div>
                </animated.div>
            </animated.div>

            {/* <animated.div style={full}>full</animated.div> */}
        </>
    )
}

export default BarStack;