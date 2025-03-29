'use client';

import { useRef, useEffect, useState } from 'react';

interface DesertSceneProps {
  isAnimating: boolean;
}

export default function DesertScene({ isAnimating }: DesertSceneProps) {
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
    
    // 汽车属性
    const car = {
      x: -100, // 初始位置在左侧屏幕外
      y: canvas.height * 0.75, // 调整到页面3/4处
      width: 120,
      height: 60,
      speed: 2,
      reachedCenter: false, // 标记汽车是否到达中心位置
      // 抖动相关属性
      shake: {
        amplitude: 1.5, // 抖动幅度
        frequency: 0.2, // 抖动频率
        offset: 0 // 抖动偏移量
      },
      // 车轮旋转相关属性
      wheels: {
        rotation: 0, // 车轮旋转角度
        speed: 0.2 // 车轮旋转速度
      }
    };
    
    // 沙漠景观元素
    const landscape = {
      dunes: [] as any[], // 沙丘
      cacti: [] as any[], // 仙人掌
      stars: [] as any[]  // 星星
    };
    const numDunes = 8;
    const numCacti = 12;
    const numStars = 100;
    
    // 道路属性
    const road = {
      offset: 0, // 道路偏移量，用于移动道路
      stripeWidth: 40, // 道路标记线宽度
      stripeGap: 60 // 道路标记线间隔
    };
    
    // 创建沙漠景观
    function createLandscape() {
      // 创建沙丘
      for (let i = 0; i < numDunes; i++) {
        const height = Math.random() * 150 + 100; // 沙丘高度
        const width = Math.random() * 300 + 200; // 沙丘宽度
        landscape.dunes.push({
          x: i * (canvas.width / (numDunes - 1)) - width/2, // 均匀分布
          y: canvas.height - height,
          width: width,
          height: height,
          color: '#D2B48C' // 沙色
        });
      }
      
      // 创建仙人掌
      for (let i = 0; i < numCacti; i++) {
        const height = Math.random() * 60 + 40;
        const width = Math.random() * 10 + 15;
        landscape.cacti.push({
          x: Math.random() * canvas.width,
          y: canvas.height * 0.75 - height,
          height: height,
          width: width,
          branches: [] // 仙人掌的分支
        });
        
        // 为每个仙人掌添加1-2个分支
        const numBranches = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < numBranches; j++) {
          landscape.cacti[i].branches.push({
            height: Math.random() * 30 + 20,
            position: Math.random() * 0.4 + 0.2, // 分支位置（相对高度）
            side: Math.random() > 0.5 ? 1 : -1 // 分支方向（左/右）
          });
        }
      }
      
      // 创建星星
      for (let i = 0; i < numStars; i++) {
        landscape.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.6),
          radius: Math.random() * 1.5 + 0.5,
          brightness: Math.random() * 0.8 + 0.2
        });
      }
    }
    
    // 绘制沙漠景观 - 修改参数类型为 CanvasRenderingContext2D
    function drawLandscape(context: CanvasRenderingContext2D) {
      // 绘制天空渐变
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height * 0.75);
      gradient.addColorStop(0, '#1A237E'); // 深蓝色
      gradient.addColorStop(0.3, '#4A148C'); // 紫色
      gradient.addColorStop(0.7, '#E65100'); // 橙色
      gradient.addColorStop(1, '#FFB74D'); // 浅橙色
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星星
      landscape.stars.forEach(star => {
        context.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });
      
      // 绘制沙丘
      landscape.dunes.forEach(dune => {
        context.fillStyle = dune.color;
        context.beginPath();
        context.moveTo(dune.x, canvas.height);
        context.quadraticCurveTo(
          dune.x + dune.width / 2, 
          dune.y,
          dune.x + dune.width, 
          canvas.height
        );
        context.fill();
        
        // 添加沙丘阴影效果
        const shadowGradient = context.createLinearGradient(
          dune.x, dune.y, 
          dune.x + dune.width, dune.y
        );
        shadowGradient.addColorStop(0, 'rgba(0,0,0,0.2)');
        shadowGradient.addColorStop(0.5, 'rgba(0,0,0,0)');
        shadowGradient.addColorStop(1, 'rgba(0,0,0,0.2)');
        context.fillStyle = shadowGradient;
        context.beginPath();
        context.moveTo(dune.x, canvas.height);
        context.quadraticCurveTo(
          dune.x + dune.width / 2, 
          dune.y,
          dune.x + dune.width, 
          canvas.height
        );
        context.fill();
      });
      
      // 绘制仙人掌
      landscape.cacti.forEach(cactus => {
        // 主干
        context.fillStyle = '#2E7D32';
        context.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
        
        // 主干顶部圆角
        context.beginPath();
        context.arc(
          cactus.x + cactus.width / 2,
          cactus.y,
          cactus.width / 2,
          0,
          Math.PI,
          true
        );
        context.fill();
        
        // 分支
// 定义 Branch 类型，包含分支的高度、位置和方向
type Branch = {
  height: number;
  position: number;
  side: number;
};
// 使用明确的类型定义来消除隐式 any 类型的警告
cactus.branches.forEach((branch: Branch) => {
          const branchY = cactus.y + cactus.height * branch.position;
          const branchX = cactus.x + (branch.side < 0 ? 0 : cactus.width);
          
          // 绘制分支
          context.fillRect(
            branchX, 
            branchY,
            branch.side * cactus.width, 
            cactus.width
          );
          
          // 绘制垂直部分
          context.fillRect(
            branchX + branch.side * cactus.width - (branch.side < 0 ? cactus.width : 0),
            branchY,
            cactus.width,
            branch.height
          );
          
          // 分支顶部圆角
          context.beginPath();
          context.arc(
            branchX + branch.side * cactus.width - (branch.side < 0 ? cactus.width : 0) + cactus.width / 2,
            branchY,
            cactus.width / 2,
            0,
            Math.PI,
            true
          );
          context.fill();
          
          // 分支连接处的圆角
          context.beginPath();
          context.arc(
            branchX,
            branchY + cactus.width / 2,
            cactus.width / 2,
            (branch.side < 0 ? 0 : Math.PI / 2),
            (branch.side < 0 ? Math.PI / 2 : Math.PI),
            false
          );
          context.fill();
        });
        
        // 添加暗绿色阴影效果
        context.fillStyle = 'rgba(0,50,0,0.5)';
        context.fillRect(cactus.x + cactus.width * 0.8, cactus.y, cactus.width * 0.2, cactus.height);
      });
    }
    
    // 移动沙漠景观
    function moveLandscape() {
      if (car.reachedCenter) {
        // 移动沙丘
        landscape.dunes.forEach(dune => {
          dune.x -= car.speed * 0.5; // 沙丘移动速度较慢，营造远景效果
          if (dune.x + dune.width < 0) {
            dune.x = canvas.width;
          }
        });
        
        // 移动仙人掌
        landscape.cacti.forEach(cactus => {
          cactus.x -= car.speed;
          if (cactus.x + cactus.width < 0) {
            cactus.x = canvas.width;
            cactus.height = Math.random() * 60 + 40;
            cactus.y = canvas.height * 0.75 - cactus.height;
            // 重新生成分支
            cactus.branches = [];
            const numBranches = Math.floor(Math.random() * 2) + 1;
            for (let j = 0; j < numBranches; j++) {
              cactus.branches.push({
                height: Math.random() * 30 + 20,
                position: Math.random() * 0.4 + 0.2,
                side: Math.random() > 0.5 ? 1 : -1
              });
            }
          }
        });
      }
    }
    
    // 绘制道路
    function drawRoad(context: CanvasRenderingContext2D) {
      // 砂石路颜色
      context.fillStyle = '#C2B280';
      context.fillRect(0, canvas.height * 0.75 + 30, canvas.width, 60);
      
      // 白色标记线（虚线）
      context.fillStyle = '#D8D0C0';
      const totalWidth = road.stripeWidth + road.stripeGap;
      const numStripes = Math.ceil(canvas.width / totalWidth) + 1;
      
      for (let i = 0; i < numStripes; i++) {
        const x = i * totalWidth - (road.offset % totalWidth);
        context.fillRect(x, canvas.height * 0.75 + 58, road.stripeWidth, 4);
      }
    }
    
    // 绘制汽车
    function drawCar(context: CanvasRenderingContext2D) {
      // 计算当前抖动的Y偏移量
      const shakeOffset = car.shake.amplitude * Math.sin(car.shake.offset);
      
      // 车身底部（越野车底盘）
      context.fillStyle = '#333333';
      context.fillRect(car.x, car.y + 10 + shakeOffset, car.width, car.height / 2);
      
      // 主车身（越野车身体）
      context.fillStyle = '#8B4513'; // 棕色 - 适合沙漠环境
      context.fillRect(car.x + 10, car.y - 10 + shakeOffset, car.width - 20, car.height / 2 + 10);
      
      // 车顶
      context.fillStyle = '#A0522D'; // 深棕色车顶
      context.fillRect(car.x + 20, car.y - 25 + shakeOffset, car.width - 45, car.height / 2);
      
      // 车窗（偏蓝色半透明）
      context.fillStyle = 'rgba(200, 230, 255, 0.6)';
      context.fillRect(car.x + 25, car.y - 20 + shakeOffset, car.width - 70, car.height / 2 - 10);
      
      // 后窗
      context.fillStyle = 'rgba(200, 230, 255, 0.5)';
      context.fillRect(car.x + car.width - 40, car.y - 20 + shakeOffset, 15, car.height / 2 - 10);
      
      // 前保险杠
      context.fillStyle = '#444444';
      context.fillRect(car.x, car.y + 15 + shakeOffset, 15, 10);
      
      // 车顶行李架
      context.strokeStyle = '#555555';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(car.x + 25, car.y - 28 + shakeOffset);
      context.lineTo(car.x + car.width - 45, car.y - 28 + shakeOffset);
      context.stroke();
      
      // 绘制三个支撑杆
      for (let i = 0; i < 3; i++) {
        const xPos = car.x + 30 + i * 20;
        context.beginPath();
        context.moveTo(xPos, car.y - 28 + shakeOffset);
        context.lineTo(xPos, car.y - 25 + shakeOffset);
        context.stroke();
      }
      
      // 车轮（黑色圆形）- 更大的越野轮胎
      context.fillStyle = '#111111';
      
      // 前轮（带旋转）
      context.save();
      context.translate(car.x + 90, car.y + 35 + shakeOffset);
      context.rotate(car.wheels.rotation);
      // 轮胎
      context.beginPath();
      context.arc(0, 0, 18, 0, Math.PI * 2);
      context.fill();
      
      // 轮胎表面花纹
      context.strokeStyle = '#333';
      context.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        context.beginPath();
        context.moveTo(9 * Math.cos(angle), 9 * Math.sin(angle));
        context.lineTo(16 * Math.cos(angle), 16 * Math.sin(angle));
        context.stroke();
      }
      
      // 轮毂
      context.fillStyle = '#777';
      context.beginPath();
      context.arc(0, 0, 8, 0, Math.PI * 2);
      context.fill();
      
      context.fillStyle = '#555';
      context.beginPath();
      context.arc(0, 0, 5, 0, Math.PI * 2);
      context.fill();
      context.restore();
      
      // 后轮（带旋转）
      context.save();
      context.translate(car.x + 30, car.y + 35 + shakeOffset);
      context.rotate(car.wheels.rotation);
      // 轮胎
      context.beginPath();
      context.arc(0, 0, 18, 0, Math.PI * 2);
      context.fill();
      
      // 轮胎表面花纹
      context.strokeStyle = '#333';
      context.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        context.beginPath();
        context.moveTo(9 * Math.cos(angle), 9 * Math.sin(angle));
        context.lineTo(16 * Math.cos(angle), 16 * Math.sin(angle));
        context.stroke();
      }
      
      // 轮毂
      context.fillStyle = '#777';
      context.beginPath();
      context.arc(0, 0, 8, 0, Math.PI * 2);
      context.fill();
      
      context.fillStyle = '#555';
      context.beginPath();
      context.arc(0, 0, 5, 0, Math.PI * 2);
      context.fill();
      context.restore();
      
      // 车灯（白色椭圆形）
      context.fillStyle = '#FFFFDD';
      context.beginPath();
      context.ellipse(car.x + 5, car.y + 5 + shakeOffset, 4, 6, 0, 0, Math.PI * 2);
      context.fill();
      
      // 车灯光效
      const glowGradient = context.createRadialGradient(
        car.x + 5, car.y + 5 + shakeOffset, 0,
        car.x + 5, car.y + 5 + shakeOffset, 15
      );
      glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
      glowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
      context.fillStyle = glowGradient;
      context.beginPath();
      context.ellipse(car.x + 5, car.y + 5 + shakeOffset, 15, 15, 0, 0, Math.PI * 2);
      context.fill();
      
      // 后灯（红色）
      context.fillStyle = '#FF3333';
      context.beginPath();
      context.rect(car.x + car.width - 5, car.y + 5 + shakeOffset, 4, 6);
      context.fill();
      
      // 沙漠灰尘效果
      if (car.reachedCenter && Math.random() > 0.7) {
        context.fillStyle = 'rgba(210, 180, 140, 0.3)';
        for (let i = 0; i < 5; i++) {
          const dustX = car.x + 10 + Math.random() * 20;
          const dustY = car.y + 40 + shakeOffset + Math.random() * 10;
          const dustSize = Math.random() * 8 + 3;
          context.beginPath();
          context.arc(dustX, dustY, dustSize, 0, Math.PI * 2);
          context.fill();
        }
      }
    }
    
    // 动画循环 - 修改函数定义，不再接收参数，而是直接使用闭包中的 ctx
    function animate() {
      if (!isAnimating) return;
      
      // 清除画布
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // 绘制沙漠景观
// 修复：添加 null 检查，确保 ctx 不为 null 时才调用 drawLandscape 函数
if (ctx) {
  drawLandscape(ctx);
}
      
      // 绘制道路
// 修复：添加 null 检查，确保 ctx 不为 null 时才调用 drawRoad 函数
if (ctx) {
  drawRoad(ctx);
}
      
      // 检查汽车是否到达屏幕中间位置
      const centerPosition = canvas.width / 2 - car.width / 2;
      
      if (!car.reachedCenter && car.x < centerPosition) {
        // 汽车还未到达中间，继续向右移动
        car.x += car.speed;
      } else {
        // 汽车已到达中间，标记为已到达中心
        car.reachedCenter = true;
        car.x = centerPosition; // 固定汽车位置在中间
        
        // 移动道路偏移量，创造道路向左移动的效果
        road.offset += car.speed;
      }
      
      // 移动沙漠景观
      moveLandscape();
      
      // 更新汽车抖动效果
      car.shake.offset += car.shake.frequency;
      
      // 更新车轮旋转
      car.wheels.rotation += car.wheels.speed;
      
      // 绘制汽车
// 修复：添加 null 检查，确保 ctx 不为 null 时才调用 drawCar 函数
if (ctx) {
  drawCar(ctx);
}
      
      // 继续动画循环
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // 初始化场景
    createLandscape();
    
    // 初始渲染
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLandscape(ctx);
    drawRoad(ctx);
    drawCar(ctx);
    
    // 如果动画标志为真，启动动画
    if (isAnimating) {
      // 修改这里，不再传递 ctx 参数
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