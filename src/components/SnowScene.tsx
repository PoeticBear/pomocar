'use client';

import { useRef, useEffect, useState } from 'react';

interface SnowSceneProps {
  isAnimating: boolean;
}

export default function SnowScene({ isAnimating }: SnowSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  
  // 初始化场景
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
  
  // 主要动画逻辑
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置Canvas大小
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // 雪地车属性
    const snowmobile = {
      x: -100, // 初始位置在左侧屏幕外
      y: canvas.height * 0.78, // 位置在页面底部偏上
      width: 120,
      height: 60,
      speed: 2,
      reachedCenter: false,
      // 抖动相关属性
      shake: {
        amplitude: 2, // 抖动幅度
        frequency: 0.15, // 抖动频率
        offset: 0 // 抖动偏移量
      },
      // 履带旋转相关属性
      track: {
        rotation: 0, // 履带旋转角度
        speed: 0.15 // 履带旋转速度
      }
    };
    
    // 雪景元素
    const winterscape = {
      mountains: [] as any[], // 雪山
      trees: [] as any[], // 松树
      snowflakes: [] as any[] // 雪花
    };
    
    const numMountains = 5;
    const numTrees = 15;
    const numSnowflakes = 200;
    
    // 创建雪景
    function createWinterscape() {
      // 创建雪山
      for (let i = 0; i < numMountains; i++) {
        const height = Math.random() * 200 + 150;
        const width = Math.random() * 500 + 300;
        winterscape.mountains.push({
          x: (i - 1) * (canvas.width / (numMountains - 2)) - width/2,
          y: canvas.height - height,
          width: width,
          height: height,
          peakOffset: Math.random() * 0.3 - 0.15 // 山峰的偏移，使其不对称
        });
      }
      
      // 创建松树
      for (let i = 0; i < numTrees; i++) {
        const height = Math.random() * 80 + 60;
        const width = height * 0.6;
        winterscape.trees.push({
          x: Math.random() * canvas.width,
          y: canvas.height - height * 0.9,
          height: height,
          width: width,
          layers: Math.floor(Math.random() * 2) + 3, // 树的层数
          snowCover: Math.random() * 0.3 + 0.1 // 雪覆盖率
        });
      }
      
      // 创建雪花
      for (let i = 0; i < numSnowflakes; i++) {
        winterscape.snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5, // 水平速度
          speedY: Math.random() * 1 + 1, // 垂直速度
          opacity: Math.random() * 0.5 + 0.5
        });
      }
    }
    
    // 绘制雪景
    function drawWinterscape(context: CanvasRenderingContext2D) {
      // 绘制天空渐变
      const skyGradient = context.createLinearGradient(0, 0, 0, canvas.height * 0.7);
      skyGradient.addColorStop(0, '#1a2a40'); // 深蓝色
      skyGradient.addColorStop(0.7, '#4b6584'); // 浅灰蓝色
      context.fillStyle = skyGradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星星
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 100; i++) {
        const x = (i * 17) % canvas.width;
        const y = (i * 23) % (canvas.height * 0.7);
        const radius = ((i * 7) % 3) + 1;
        const opacity = ((i * 13) % 8) / 10 + 0.2;
        
        context.globalAlpha = opacity;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      
      // 绘制月亮
      const moonGradient = context.createRadialGradient(
        canvas.width * 0.8, 
        canvas.height * 0.2, 
        5,
        canvas.width * 0.8, 
        canvas.height * 0.2, 
        50
      );
      moonGradient.addColorStop(0, 'rgba(255, 255, 240, 1)');
      moonGradient.addColorStop(0.3, 'rgba(255, 255, 240, 0.9)');
      moonGradient.addColorStop(1, 'rgba(255, 255, 240, 0)');
      
      context.fillStyle = moonGradient;
      context.beginPath();
      context.arc(canvas.width * 0.8, canvas.height * 0.2, 50, 0, Math.PI * 2);
      context.fill();
      
      // 绘制雪山
      winterscape.mountains.forEach(mountain => {
        // 山体渐变
        const mountainGradient = context.createLinearGradient(
          mountain.x, mountain.y, 
          mountain.x + mountain.width, mountain.y + mountain.height
        );
        mountainGradient.addColorStop(0, '#f1f2f6'); // 亮白色
        mountainGradient.addColorStop(0.4, '#dfe4ea'); // 浅灰色
        mountainGradient.addColorStop(1, '#a5b1c2'); // 深灰色
        
        context.fillStyle = mountainGradient;
        context.beginPath();
        context.moveTo(mountain.x, canvas.height);
        
        // 山峰中点的偏移
        const peakX = mountain.x + mountain.width * (0.5 + mountain.peakOffset);
        
        // 绘制山峰（使用二次贝塞尔曲线创建不对称的山峰）
        context.quadraticCurveTo(
          mountain.x + mountain.width * 0.25, 
          mountain.y + mountain.height * 0.5,
          peakX, 
          mountain.y
        );
        
        context.quadraticCurveTo(
          mountain.x + mountain.width * 0.75, 
          mountain.y + mountain.height * 0.6,
          mountain.x + mountain.width, 
          canvas.height
        );
        
        context.fill();
        
        // 添加山体阴影和雪线
        context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(mountain.x + mountain.width * 0.2, mountain.y + mountain.height * 0.3);
        context.lineTo(peakX, mountain.y);
        context.lineTo(mountain.x + mountain.width * 0.8, mountain.y + mountain.height * 0.25);
        context.stroke();
      });
      
      // 绘制地面雪原
      context.fillStyle = '#f1f2f6';
      context.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);
      
      // 雪地纹理
      context.fillStyle = 'rgba(200, 210, 220, 0.3)';
      for (let i = 0; i < 100; i++) {
        const x = (i * 29) % canvas.width;
        const y = canvas.height * 0.75 + (i * 17) % (canvas.height * 0.25);
        const width = ((i * 13) % 50) + 20;
        const height = ((i * 11) % 10) + 5;
        
        context.beginPath();
        context.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
        context.fill();
      }
      
      // 绘制松树
      winterscape.trees.forEach(tree => {
        // 树干
        context.fillStyle = '#3d3d3d';
        context.fillRect(
          tree.x + tree.width * 0.45, 
          tree.y + tree.height * 0.8, 
          tree.width * 0.1, 
          tree.height * 0.2
        );
        
        // 树冠（多层三角形）
        const layerHeight = tree.height * 0.7 / tree.layers;
        
        for (let i = 0; i < tree.layers; i++) {
          const layerWidth = tree.width * (1 - i * 0.15);
          const layerY = tree.y + i * layerHeight;
          
          // 树层渐变（深绿到浅绿）
          context.fillStyle = '#2e7830';
          
          // 绘制三角形树层
          context.beginPath();
          context.moveTo(tree.x + (tree.width - layerWidth) / 2, layerY);
          context.lineTo(tree.x + (tree.width + layerWidth) / 2, layerY);
          context.lineTo(tree.x + tree.width / 2, layerY - layerHeight);
          context.closePath();
          context.fill();
          
          // 雪覆盖
          context.fillStyle = 'rgba(255, 255, 255, 0.7)';
          context.beginPath();
          context.moveTo(tree.x + (tree.width - layerWidth) / 2, layerY);
          context.lineTo(tree.x + (tree.width + layerWidth) / 2, layerY);
          context.lineTo(tree.x + tree.width / 2, layerY - layerHeight * tree.snowCover);
          context.closePath();
          context.fill();
        }
      });
      
      // 绘制雪花
      context.fillStyle = '#ffffff';
      winterscape.snowflakes.forEach(snowflake => {
        context.globalAlpha = snowflake.opacity;
        context.beginPath();
        context.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
    }
    
    // 绘制雪地小路
    function drawSnowTrail(context: CanvasRenderingContext2D) {
      // 雪地小路
      context.fillStyle = '#dfe4ea';
      context.fillRect(0, canvas.height * 0.75 + 20, canvas.width, 30);
      
      // 小路纹理
      context.strokeStyle = '#c8d6e5';
      context.lineWidth = 1;
      
      for (let i = 0; i < canvas.width; i += 50) {
        context.beginPath();
        context.moveTo(i, canvas.height * 0.75 + 25);
        context.lineTo(i + 30, canvas.height * 0.75 + 25);
        context.stroke();
      }
    }
    
    // 绘制雪地车
    function drawSnowmobile(context: CanvasRenderingContext2D) {
      // 计算当前抖动的Y偏移量
      const shakeOffset = snowmobile.shake.amplitude * Math.sin(snowmobile.shake.offset);
      
      // 坐标变换
      context.save();
      context.translate(snowmobile.x, snowmobile.y + shakeOffset);
      
      // 履带
      context.fillStyle = '#1e272e';
      context.fillRect(10, 20, snowmobile.width - 20, 15);
      
      // 履带纹理
      context.fillStyle = '#485460';
      for (let i = 0; i < 6; i++) {
        context.fillRect(20 + i * 16, 27, 8, 8);
      }
      
      // 车身底部
      context.fillStyle = '#0abde3';
      context.beginPath();
      context.moveTo(0, 15);
      context.lineTo(snowmobile.width, 15);
      context.lineTo(snowmobile.width - 10, 30);
      context.lineTo(10, 30);
      context.closePath();
      context.fill();
      
      // 车座
      context.fillStyle = '#222f3e';
      context.fillRect(snowmobile.width * 0.3, -15, snowmobile.width * 0.4, 25);
      
      // 挡风玻璃
      context.fillStyle = 'rgba(200, 230, 255, 0.7)';
      context.beginPath();
      context.moveTo(snowmobile.width * 0.7, -15);
      context.lineTo(snowmobile.width * 0.85, -30);
      context.lineTo(snowmobile.width * 0.7, -30);
      context.closePath();
      context.fill();
      
      // 前部导向雪橇
      context.fillStyle = '#576574';
      context.beginPath();
      context.moveTo(snowmobile.width * 0.75, 15);
      context.lineTo(snowmobile.width * 0.9, 5);
      context.lineTo(snowmobile.width + 10, 10);
      context.lineTo(snowmobile.width, 15);
      context.closePath();
      context.fill();
      
      // 引擎盖
      context.fillStyle = '#0abde3';
      context.beginPath();
      context.moveTo(snowmobile.width * 0.3, 0);
      context.lineTo(snowmobile.width * 0.7, 0);
      context.lineTo(snowmobile.width * 0.9, -10);
      context.lineTo(snowmobile.width * 0.7, -15);
      context.lineTo(snowmobile.width * 0.3, -15);
      context.closePath();
      context.fill();
      
      // 车灯
      context.fillStyle = '#fff';
      context.beginPath();
      context.arc(snowmobile.width * 0.85, -5, 5, 0, Math.PI * 2);
      context.fill();
      
      // 车灯光效
      const glowGradient = context.createRadialGradient(
        snowmobile.width * 0.85, -5, 0,
        snowmobile.width * 0.85, -5, 30
      );
      glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
      glowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
      context.fillStyle = glowGradient;
      context.beginPath();
      context.arc(snowmobile.width * 0.85, -5, 30, 0, Math.PI * 2);
      context.fill();
      
      // 排气
      if (snowmobile.reachedCenter && Math.random() > 0.3) {
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 3; i++) {
          const size = Math.random() * 10 + 5;
          const xOffset = Math.random() * 5 - 10;
          context.beginPath();
          context.arc(20 + xOffset, 0, size, 0, Math.PI * 2);
          context.fill();
        }
      }
      
      context.restore();
    }
    
    // 移动雪景元素
    function moveWinterscape() {
      if (snowmobile.reachedCenter) {
        // 移动树木
        winterscape.trees.forEach(tree => {
          tree.x -= snowmobile.speed;
          if (tree.x + tree.width < 0) {
            tree.x = canvas.width;
            tree.height = Math.random() * 80 + 60;
            tree.width = tree.height * 0.6;
            tree.y = canvas.height - tree.height * 0.9;
            tree.layers = Math.floor(Math.random() * 2) + 3;
          }
        });
        
        // 移动山脉（缓慢）
        winterscape.mountains.forEach(mountain => {
          mountain.x -= snowmobile.speed * 0.5;
          if (mountain.x + mountain.width < 0) {
            mountain.x = canvas.width;
          }
        });
      }
      
      // 移动雪花
      winterscape.snowflakes.forEach(snowflake => {
        snowflake.x += snowflake.speedX;
        snowflake.y += snowflake.speedY;
        
        // 如果雪花飘出屏幕，重置到顶部
        if (snowflake.y > canvas.height) {
          snowflake.y = 0;
          snowflake.x = Math.random() * canvas.width;
        }
        
        // 如果雪花飘出左右边界，也重置
        if (snowflake.x < 0 || snowflake.x > canvas.width) {
          snowflake.x = Math.random() * canvas.width;
        }
      });
    }
    
    // 动画循环
    function animate() {
      if (!isAnimating) return;
      
      // 清除画布
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // 绘制雪景
      if (ctx) {
        drawWinterscape(ctx);
        drawSnowTrail(ctx);
      }
      
      // 检查雪地车是否到达屏幕中间位置
      const centerPosition = canvas.width / 2 - snowmobile.width / 2;
      
      if (!snowmobile.reachedCenter && snowmobile.x < centerPosition) {
        // 雪地车还未到达中间，继续向右移动
        snowmobile.x += snowmobile.speed;
      } else {
        // 雪地车已到达中间，标记为已到达中心
        snowmobile.reachedCenter = true;
        snowmobile.x = centerPosition; // 固定雪地车位置在中间
      }
      
      // 移动雪景元素
      moveWinterscape();
      
      // 更新雪地车抖动效果
      snowmobile.shake.offset += snowmobile.shake.frequency;
      
      // 更新履带旋转
      snowmobile.track.rotation += snowmobile.track.speed;
      
      // 绘制雪地车
      if (ctx) {
        drawSnowmobile(ctx);
      }
      
      // 继续动画循环
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // 初始化场景
    createWinterscape();
    
    // 初始渲染
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWinterscape(ctx);
    drawSnowTrail(ctx);
    drawSnowmobile(ctx);
    
    // 如果动画标志为真，启动动画
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