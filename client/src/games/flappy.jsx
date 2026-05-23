import React, { useEffect, useRef, useState } from 'react';
import Masthead from '../components/Masthead.jsx';
import '../styles/np-front-page.css';

const FlappyBird = () => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);

    // Game Constants
    const GRAVITY = 0.25;
    const JUMP = -4.5;
    const PIPE_SPEED = 2;
    const PIPE_SPAWN_RATE = 90;
    const PIPE_GAP = 130;
    const CANVAS_WIDTH = 320;
    const CANVAS_HEIGHT = 480;

    // Mutable game refs (to avoid re-render lag)
    const bird = useRef({ x: 50, y: 150, w: 25, h: 25, velocity: 0 });
    const pipes = useRef([]);
    const frameCount = useRef(0);
    const internalScore = useRef(0);

    const resetGame = () => {
        bird.current = { x: 50, y: 150, w: 25, h: 25, velocity: 0 };
        pipes.current = [];
        frameCount.current = 0;
        internalScore.current = 0;
        setScore(0);
        setGameState('PLAYING');
    };

    const flap = () => {
        if (gameState === 'PLAYING') {
            bird.current.velocity = JUMP;
        } else if (gameState !== 'PLAYING') {
            resetGame();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const update = () => {
            if (gameState !== 'PLAYING') return;

            // Bird Physics
            bird.current.velocity += GRAVITY;
            bird.current.y += bird.current.velocity;

            // Wall Collision
            if (bird.current.y + bird.current.h > CANVAS_HEIGHT || bird.current.y < 0) {
                setGameState('GAME_OVER');
            }

            // Pipe Logic
            if (frameCount.current % PIPE_SPAWN_RATE === 0) {
                const pipeHeight = Math.floor(Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100)) + 50;
                pipes.current.push({ x: CANVAS_WIDTH, y: pipeHeight, passed: false });
            }

            pipes.current.forEach((pipe, i) => {
                pipe.x -= PIPE_SPEED;

                // Score
                if (!pipe.passed && bird.current.x > pipe.x + 40) {
                    pipe.passed = true;
                    internalScore.current += 1;
                    setScore(internalScore.current);
                }

                // Pipe Collision
                if (
                    bird.current.x < pipe.x + 40 &&
                    bird.current.x + bird.current.w > pipe.x &&
                    (bird.current.y < pipe.y || bird.current.y + bird.current.h > pipe.y + PIPE_GAP)
                ) {
                    setGameState('GAME_OVER');
                }

                if (pipe.x + 40 < 0) pipes.current.splice(i, 1);
            });

            frameCount.current++;
        };

        const draw = () => {
            // Sky
            ctx.fillStyle = '#70c5ce';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Pipes
            ctx.fillStyle = '#2e8b57';
            pipes.current.forEach(pipe => {
                ctx.fillRect(pipe.x, 0, 40, pipe.y); // Top
                ctx.fillRect(pipe.x, pipe.y + PIPE_GAP, 40, CANVAS_HEIGHT); // Bottom
            });

            // Bird
            ctx.fillStyle = '#f4d03f';
            ctx.fillRect(bird.current.x, bird.current.y, bird.current.w, bird.current.h);

            // UI Text
            if (gameState === 'START') {
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.font = '20px Arial';
                ctx.fillText('CLICK TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            }

            if (gameState === 'GAME_OVER') {
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.font = '30px Arial';
                ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
                ctx.font = '18px Arial';
                ctx.fillText('Click to Try Again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
            }
        };

        const render = () => {
            update();
            draw();
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [gameState]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#222'
            }}
        >
            <div style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                Score: {score}
            </div>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={flap}
                style={{
                    cursor: 'pointer',
                    border: '5px solid white',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
            />
            <div style={{ color: '#aaa', marginTop: '1rem' }}>
                Press Screen to Jump
            </div>
        </div>
    );
};

export default FlappyBird;