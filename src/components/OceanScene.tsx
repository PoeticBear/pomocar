'use client';

import { useRef, useEffect, useState } from 'react';

interface OceanSceneProps {
  isAnimating: boolean;
}

export default function OceanScene({ isAnimating }: OceanSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  
  // Initialize scene
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Main animation logic
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Boat properties
    const boat = {
      x: -100, // Initial position off-screen to the left
      y: canvas.height * 0.6, // Position at 60% of the page height
      width: 120,
      height: 80,
      speed: 2,
      reachedCenter: false,
      // Bobbing properties
      bob: {
        amplitude: 3, // Bobbing amplitude
        frequency: 0.05, // Bobbing frequency
        offset: 0 // Bobbing offset
      }
    };
    
    // Ocean scene elements
    const seascape = {
      clouds: [] as any[],
      waves: [] as any[],
      fishes: [] as any[],
      seagulls: [] as any[]
    };
    
    const numClouds = 6;
    const numWaves = 5;
    const numFishes = 8;
    const numSeagulls = 4;
    
    // Create ocean landscape
    function createSeascape() {
      // Create clouds
      for (let i = 0; i < numClouds; i++) {
        seascape.clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.3),
          width: Math.random() * 150 + 100,
          height: Math.random() * 50 + 40,
          speed: Math.random() * 0.2 + 0.1 // Different speeds for parallax effect
        });
      }
      
      // Create waves
      for (let i = 0; i < numWaves; i++) {
        seascape.waves.push({
          x: 0,
          y: canvas.height * 0.6 + i * 15,
          amplitude: 20 / (i + 1), // Decreasing amplitude for deeper waves
          frequency: 0.01 * (i + 1), // Increasing frequency for deeper waves
          speed: 0.05 * (i + 1), // Speed of wave movement
          offset: Math.random() * Math.PI * 2, // Random starting phase
          color: `rgba(0, 70, 140, ${0.2 + i * 0.15})` // Deeper blue for deeper waves
        });
      }
      
      // Create fish
      for (let i = 0; i < numFishes; i++) {
        seascape.fishes.push({
          x: Math.random() * canvas.width,
          y: canvas.height * 0.7 + Math.random() * (canvas.height * 0.25),
          size: Math.random() * 20 + 10,
          speed: Math.random() * 2 + 1,
          direction: Math.random() > 0.5 ? 1 : -1, // 1 for right, -1 for left
          color: ['#FF9F40', '#4D9DE0', '#E15554', '#3BB273', '#7768AE'][Math.floor(Math.random() * 5)]
        });
      }
      
      // Create seagulls
      for (let i = 0; i < numSeagulls; i++) {
        seascape.seagulls.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.4),
          size: Math.random() * 10 + 5,
          speed: Math.random() * 1.5 + 0.5,
          wingOffset: Math.random() * Math.PI * 2,
          wingSpeed: Math.random() * 0.1 + 0.05
        });
      }
    }
    
    // Draw ocean scene
    function drawSeascape(context: CanvasRenderingContext2D) {
      // Draw sky gradient
      const skyGradient = context.createLinearGradient(0, 0, 0, canvas.height * 0.6);
      skyGradient.addColorStop(0, '#1A90D6'); // Light blue at top
      skyGradient.addColorStop(1, '#87CEEB'); // Sky blue at horizon
      context.fillStyle = skyGradient;
      context.fillRect(0, 0, canvas.width, canvas.height * 0.6);
      
      // Draw clouds
      context.fillStyle = '#FFFFFF';
      seascape.clouds.forEach(cloud => {
        // Main cloud body
        context.beginPath();
        context.arc(cloud.x, cloud.y, cloud.height / 2, 0, Math.PI * 2);
        context.arc(cloud.x + cloud.width * 0.25, cloud.y - cloud.height * 0.1, cloud.height * 0.6, 0, Math.PI * 2);
        context.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.height * 0.7, 0, Math.PI * 2);
        context.arc(cloud.x + cloud.width * 0.75, cloud.y - cloud.height * 0.1, cloud.height * 0.6, 0, Math.PI * 2);
        context.arc(cloud.x + cloud.width, cloud.y, cloud.height / 2, 0, Math.PI * 2);
        context.fill();
      });
      
      // Draw ocean
      const oceanGradient = context.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      oceanGradient.addColorStop(0, '#0077BE'); // Brighter blue at surface
      oceanGradient.addColorStop(1, '#003366'); // Darker blue at depth
      context.fillStyle = oceanGradient;
      context.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
      
      // Draw waves
      seascape.waves.forEach(wave => {
        context.strokeStyle = wave.color;
        context.lineWidth = 5;
        context.beginPath();
        
        // Start at the left edge
        context.moveTo(0, wave.y);
        
        // Draw wave using sine function
        for (let x = 0; x <= canvas.width; x += 20) {
          const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
          context.lineTo(x, y);
        }
        
        context.stroke();
      });
      
      // Draw seagulls
      seascape.seagulls.forEach(seagull => {
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        
        // Wings up and down based on animation
        const wingY = Math.sin(seagull.wingOffset) * seagull.size / 2;
        
        context.beginPath();
        // Left wing
        context.moveTo(seagull.x, seagull.y);
        context.lineTo(seagull.x - seagull.size, seagull.y - wingY);
        
        // Right wing
        context.moveTo(seagull.x, seagull.y);
        context.lineTo(seagull.x + seagull.size, seagull.y - wingY);
        
        context.stroke();
      });
      
      // Draw fish
      seascape.fishes.forEach(fish => {
        context.fillStyle = fish.color;
        
        // Save context for rotation and translation
        context.save();
        context.translate(fish.x, fish.y);
        // Scale to flip fish based on direction
        context.scale(fish.direction, 1);
        
        // Fish body
        context.beginPath();
        context.ellipse(0, 0, fish.size, fish.size / 2, 0, 0, Math.PI * 2);
        context.fill();
        
        // Tail
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-fish.size, -fish.size / 2);
        context.lineTo(-fish.size, fish.size / 2);
        context.closePath();
        context.fill();
        
        // Fish eye
        context.fillStyle = '#FFFFFF';
        context.beginPath();
        context.arc(fish.size / 2, -fish.size / 6, fish.size / 6, 0, Math.PI * 2);
        context.fill();
        
        context.fillStyle = '#000000';
        context.beginPath();
        context.arc(fish.size / 2, -fish.size / 6, fish.size / 10, 0, Math.PI * 2);
        context.fill();
        
        // Restore context
        context.restore();
      });
    }
    
    // Move seascape elements
    function moveSeascape() {
      // Move clouds
      seascape.clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
          cloud.x = canvas.width;
          cloud.y = Math.random() * (canvas.height * 0.3);
        }
      });
      
      // Animate waves
      seascape.waves.forEach(wave => {
        wave.offset += wave.speed;
      });
      
      // Move fish
      seascape.fishes.forEach(fish => {
        fish.x += fish.speed * fish.direction;
        
        // If fish goes off screen, bring it back from the other side
        if ((fish.direction > 0 && fish.x > canvas.width + fish.size) || 
            (fish.direction < 0 && fish.x < -fish.size)) {
          fish.x = fish.direction > 0 ? -fish.size : canvas.width + fish.size;
          fish.y = canvas.height * 0.7 + Math.random() * (canvas.height * 0.25);
        }
      });
      
      // Animate seagulls
      seascape.seagulls.forEach(seagull => {
        seagull.x += seagull.speed;
        seagull.wingOffset += seagull.wingSpeed;
        
        // Reset position if seagull flies off screen
        if (seagull.x > canvas.width + seagull.size) {
          seagull.x = -seagull.size;
          seagull.y = Math.random() * (canvas.height * 0.4);
        }
      });
    }
    
    // Draw boat
    function drawBoat(context: CanvasRenderingContext2D) {
      // Calculate current bobbing Y offset
      const bobOffset = boat.bob.amplitude * Math.sin(boat.bob.offset);
      
      // Hull
      context.fillStyle = '#8B4513'; // Brown hull
      context.beginPath();
      context.moveTo(boat.x, boat.y + bobOffset);
      context.lineTo(boat.x + boat.width, boat.y + bobOffset);
      context.lineTo(boat.x + boat.width * 0.8, boat.y + boat.height * 0.3 + bobOffset);
      context.lineTo(boat.x + boat.width * 0.2, boat.y + boat.height * 0.3 + bobOffset);
      context.closePath();
      context.fill();
      
      // Cabin
      context.fillStyle = '#D2B48C'; // Tan cabin
      context.fillRect(
        boat.x + boat.width * 0.3, 
        boat.y - boat.height * 0.3 + bobOffset, 
        boat.width * 0.4, 
        boat.height * 0.3
      );
      
      // Windows
      context.fillStyle = '#87CEEB'; // Sky blue windows
      context.fillRect(
        boat.x + boat.width * 0.35, 
        boat.y - boat.height * 0.25 + bobOffset, 
        boat.width * 0.1, 
        boat.height * 0.15
      );
      
      context.fillRect(
        boat.x + boat.width * 0.55, 
        boat.y - boat.height * 0.25 + bobOffset, 
        boat.width * 0.1, 
        boat.height * 0.15
      );
      
      // Mast
      context.fillStyle = '#8B4513';
      context.fillRect(
        boat.x + boat.width * 0.5 - 2, 
        boat.y - boat.height * 0.8 + bobOffset, 
        4, 
        boat.height * 0.8
      );
      
      // Sail
      context.fillStyle = '#FFFFFF';
      context.beginPath();
      context.moveTo(boat.x + boat.width * 0.5, boat.y - boat.height * 0.8 + bobOffset);
      context.lineTo(boat.x + boat.width * 0.75, boat.y - boat.height * 0.4 + bobOffset);
      context.lineTo(boat.x + boat.width * 0.5, boat.y - boat.height * 0.3 + bobOffset);
      context.closePath();
      context.fill();
      
      // Sail shadow
      context.fillStyle = 'rgba(0,0,0,0.1)';
      context.beginPath();
      context.moveTo(boat.x + boat.width * 0.5, boat.y - boat.height * 0.8 + bobOffset);
      context.lineTo(boat.x + boat.width * 0.65, boat.y - boat.height * 0.6 + bobOffset);
      context.lineTo(boat.x + boat.width * 0.55, boat.y - boat.height * 0.4 + bobOffset);
      context.closePath();
      context.fill();
      
      // Wake behind the boat if it's reached center
      if (boat.reachedCenter) {
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 2;
        
        for (let i = 0; i < 3; i++) {
          const wakeX = boat.x - i * 20;
          const wakeWidth = i * 10 + 10;
          
          context.beginPath();
          context.moveTo(wakeX, boat.y + boat.height * 0.15 + bobOffset);
          context.quadraticCurveTo(
            wakeX - wakeWidth / 2, 
            boat.y + boat.height * 0.15 + wakeWidth/4 + bobOffset, 
            wakeX - wakeWidth, 
            boat.y + boat.height * 0.15 + bobOffset
          );
          context.stroke();
        }
      }
    }
    
    // Animation loop
    function animate() {
      if (!isAnimating) return;
      
      // Clear canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw ocean scene
      if (ctx) {
        drawSeascape(ctx);
      }
      
      // Check if boat has reached center of screen
      const centerPosition = canvas.width / 2 - boat.width / 2;
      
      if (!boat.reachedCenter && boat.x < centerPosition) {
        // Boat still moving to center
        boat.x += boat.speed;
      } else {
        // Boat has reached center
        boat.reachedCenter = true;
        boat.x = centerPosition; // Keep boat in center
        
        // Move seascape to create illusion of movement
        moveSeascape();
      }
      
      // Update boat bobbing effect
      boat.bob.offset += boat.bob.frequency;
      
      // Draw boat
      if (ctx) {
        drawBoat(ctx);
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // Initialize scene
    createSeascape();
    
    // Initial render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSeascape(ctx);
    drawBoat(ctx);
    
    // Start animation if flag is true
    if (isAnimating) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isAnimating]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="block"
      style={{ width: '100%', height: '100%' }}
    />
  );
} 