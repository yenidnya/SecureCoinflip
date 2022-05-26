import React, { useRef } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Mesh, Vector3 } from "three"
import { OrbitControls } from "@react-three/drei"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import * as THREE from "three"

export const CoinPrimative: React.FunctionComponent = () => {
    const ref = useRef<Mesh>(null!)
    useFrame((state, delta) => (ref.current.rotation.x += 0.02))
    useThree(({ camera }) => {
        camera.position.set(0, 0, 6)
    })
    const materials = useLoader(MTLLoader, "/hellerCoin/10 Heller.mtl")
    const object = useLoader(OBJLoader, "/hellerCoin/10 Heller.obj", (loader) => {
        materials.preload()
        ;(loader as any).setMaterials(materials)
    })

    var objBbox = new THREE.Box3().setFromObject(object)

    // Geometry vertices centering to world axis
    var bboxCenter = objBbox.getCenter(new Vector3(0, 0, 0)).clone()
    bboxCenter.multiplyScalar(-1)

    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z)
        }
    })

    objBbox.setFromObject(object) // Update the bounding box

    return (
        <>
            <OrbitControls />
            <ambientLight />
            <primitive ref={ref} object={object} position={[0, 0, 0]} scale={[1, 1, 1]} />
        </>
    )
}

const Coin: React.FunctionComponent = () => {
    return (
        <Canvas>
            <CoinPrimative />
        </Canvas>
    )
}

export default Coin
