'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// Uncomment for debugging:
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Animate22() {
    const mountRef = useRef(null)

    useEffect(() => {
        if (!mountRef.current) return

        const scene = new THREE.Scene()

        // Add ambient light + directional light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5, 10, 7.5)
        scene.add(directionalLight)

        // Add axes helper for debugging
        const axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper)

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.z = 10 // set farther back

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x0000ff) // black background
        mountRef.current.appendChild(renderer.domElement)


        // after camera & renderer creation
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        // in animate()
        controls.update()

        // Uncomment below for orbit controls debugging:
        /*
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        */

        const loader = new GLTFLoader()
        let model = null

        loader.load(
            '/models/wall_e.glb',
            (gltf) => {
                console.log('Model loaded:', gltf)
                model = gltf.scene

                // Fix materials
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.side = THREE.DoubleSide
                        child.material.transparent = false
                        child.material.opacity = 1
                    }
                })

                // Log bounding box
                const box = new THREE.Box3().setFromObject(model)
                console.log('Bounding box:', box)
                const size = box.getSize(new THREE.Vector3())
                console.log('Model size:', size)

                model.position.set(0, 0, 0)
                model.scale.set(3, 3, 3) // adjust as needed
                scene.add(model)
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error)
            }
        )


        const animate = () => {
            requestAnimationFrame(animate)

            if (model) {
                let scrollPercent =
                    window.scrollY / (document.body.scrollHeight - window.innerHeight)
                model.rotation.y = scrollPercent * Math.PI * 2
            }

            controls.update()
            renderer.render(scene, camera)
        }


        animate()

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [])

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
}
