"use client";
import React, { useEffect } from 'react';
import '../styles/Background.css';
import * as PIXI from "pixi.js";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import { createNoise2D } from "simplex-noise";
import hsl from "hsl-to-hex";
import debounce from "debounce";


function Background(props) {
    useEffect(() => {
        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        function map(n, start1, end1, start2, end2) {
            return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
        }

        const noise2D = createNoise2D(Math.random);

        class ColorPalette {
            constructor() {
                this.setColors();
                this.setCustomProperties();
            }

            setColors() {
                this.hue = ~~random(220, 360);
                this.complimentaryHue1 = this.hue + 30;
                this.complimentaryHue2 = this.hue + 60;
                this.saturation = 95;
                this.lightness = 50;

                this.baseColor = hsl(this.hue, this.saturation, this.lightness);
                this.complimentaryColor1 = hsl(
                    this.complimentaryHue1,
                    this.saturation,
                    this.lightness
                );
                this.complimentaryColor2 = hsl(
                    this.complimentaryHue2,
                    this.saturation,
                    this.lightness
                );

                this.colorChoices = [
                    this.baseColor,
                    this.complimentaryColor1,
                    this.complimentaryColor2
                ];
            }

            randomColor() {
                return this.colorChoices[~~random(0, this.colorChoices.length)].replace("#", "0x");
            }

            setCustomProperties() {
                document.documentElement.style.setProperty("--hue", this.hue);
                document.documentElement.style.setProperty("--hue-complimentary1", this.complimentaryHue1);
                document.documentElement.style.setProperty("--hue-complimentary2", this.complimentaryHue2);
            }
        }

        class Orb {
            constructor(fill = 0x000000) {
                this.bounds = this.setBounds();
                this.x = random(this.bounds["x"].min, this.bounds["x"].max);
                this.y = random(this.bounds["y"].min, this.bounds["y"].max);

                this.scale = 1;
                this.fill = fill;
                this.radius = random(window.innerHeight / 6, window.innerHeight / 3);
                this.xOff = random(0, 1000);
                this.yOff = random(0, 1000);
                this.inc = 0.002;

                this.graphics = new PIXI.Graphics();
                this.graphics.alpha = 0.825;

                window.addEventListener(
                    "resize",
                    debounce(() => {
                        this.bounds = this.setBounds();
                    }, 250)
                );
            }

            setBounds() {
                const maxDist = window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
                const originX = window.innerWidth / 1.25;
                const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 1.375;

                return {
                    x: {
                        min: originX - maxDist,
                        max: originX + maxDist
                    },
                    y: {
                        min: originY - maxDist,
                        max: originY + maxDist
                    }
                };
            }

            update() {
                const xNoise = noise2D(this.xOff, this.xOff);
                const yNoise = noise2D(this.yOff, this.yOff);
                const scaleNoise = noise2D(this.xOff, this.yOff);

                this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
                this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
                this.scale = map(scaleNoise, -1, 1, 0.5, 1);

                this.xOff += this.inc;
                this.yOff += this.inc;
            }

            render() {
                this.graphics.x = this.x;
                this.graphics.y = this.y;
                this.graphics.scale.set(this.scale);

                this.graphics.clear();

                this.graphics.beginFill(this.fill);
                this.graphics.drawCircle(0, 0, this.radius);
                this.graphics.endFill();
            }
        }

        const app = new PIXI.Application({
            view: document.querySelector(".orb-canvas"),
            resizeTo: window,
            transparent: true
        });

        app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

        const colorPalette = new ColorPalette();

        const orbs = [];
        for (let i = 0; i < 10; i++) {
            const orb = new Orb(colorPalette.randomColor());

            app.stage.addChild(orb.graphics);
            orbs.push(orb);
        }

        // Animate!
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            app.ticker.add(() => {
                orbs.forEach((orb) => {
                    orb.update();
                    orb.render();
                });
            });
        } else {
            orbs.forEach((orb) => {
                orb.update();
                orb.render();
            });
        }

        // When the component is unmounted, we should cleanup our resources.
        return () => {
            app.ticker.stop();

            while (app.stage.children[0]) {
                app.stage.removeChild(app.stage.children[0]);
            }

            orbs.length = 0;

            app.renderer.render(app.stage); // Clears the renderer
            app.view.parentNode.removeChild(app.view); // Remove canvas from DOM
            app.destroy({
                children: true, // Default is false
                texture: true,
                baseTexture: true
            });
        };
    }, []); // Passing an empty array as dependency to useEffect makes it run only on mount and unmount, ensuring the canvas is initialized only once.

    return <canvas className="orb-canvas" />;
}

export default Background;

