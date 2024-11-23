// import { Suspense, useEffect, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

// import CanvasLoader from "./Loader";

// function Computers({ isMobile }: { isMobile: boolean }) {
//   const computer = useGLTF("./desktop_pc/scene.gltf");

//   return (
//     <mesh>
//       <ambientLight intensity={1} />
//       <hemisphereLight intensity={0.15} groundColor="black" />
//       <pointLight intensity={1} />

//       <primitive
//         object={computer.scene}
//         scale={isMobile ? 0.7 : 1.1}
//         position={isMobile ? [0, -2, -2.2] : [0, -2, -1.5]}
//         rotation={[-0.01, -0.2, -0.1]}
//       />
//     </mesh>
//   );
// }

// function ComputerCanvas() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 500px)");

//     setIsMobile(mediaQuery.matches);

//     const handleMediaQueryChange = (event: any) => {
//       setIsMobile(event.matches);
//     };

//     mediaQuery.addEventListener("change", handleMediaQueryChange);

//     return () => {
//       mediaQuery.removeEventListener("change", handleMediaQueryChange);
//     };
//   }, []);

//   return (
//     <Canvas
//       frameloop="demand"
//       shadows
//       camera={{ position: [20, 3, 5], fov: 25 }}
//       gl={{ preserveDrawingBuffer: true }}
//     >
//       <Suspense fallback={<CanvasLoader />}>
//         <OrbitControls
//           enableZoom={false}
//           maxPolarAngle={Math.PI / 2}
//           minPolarAngle={Math.PI / 2}
//         />
//         <Computers isMobile={isMobile} />
//       </Suspense>
//       <Preload all />
//     </Canvas>
//   );
// }

// export default ComputerCanvas;

// // function ComputerCanvas() {
// //   return <div>Computers</div>;
// // }
// // export default ComputerCanvas;
