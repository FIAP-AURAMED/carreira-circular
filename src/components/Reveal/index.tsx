import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface Props {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
}

export const Reveal = ({ children, width = "fit-content", delay = 0 }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" }); // Dispara quando o elemento entra na tela
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.8, delay: delay, ease: [0.25, 0.25, 0.25, 0.75] }} // Curva de animação suave estilo Apple/Linear
            >
                {children}
            </motion.div>
        </div>
    );
};