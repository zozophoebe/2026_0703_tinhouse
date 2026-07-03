// let color_palette = ["#62A893", "#A2B4AA", "#C4BA84", "#92563C"];
// let basePalette = ["#789280", "#3E8D72"];
let color_palette;
let basePalette;
let padding = 300; // 畫布邊界距離

async function setup() {
  createCanvas(2000, 1400); // 畫布大小：width, height
  colorMode(HSB);

  // // 呼叫自己建立的函式
  // FF_rect(700, 500, 50, 50, 10, 10, 4);

  let color_rand = random();
  // features setting
  if (color_rand < 0.4) {
    // "rusty blue"
    color_palette = ["#62A893", "#A2B4AA", "#C4BA84", "#92563C"];
    basePalette = ["#789280", "#3E8D72"];
  } else if (color_rand < 0.7) {
    // "blue"
    color_palette = ["#B8CCD8", "#0D0906", "#775139", "#DC975B"];
    basePalette = ["#76A8C1", "#8F8C81"];
  } else {
    // "light blue"
    color_palette = ["#5E8F99", "#ABB5A4", "#28272C", "#B18868", "#DFDCD2"];
    basePalette = ["#7DA9AB"];
  }
  background(random(basePalette)); // 背景顏色

  let xsum = 0;
  // 使用迴圈繪製 - 底色層
  for (let i = 0; i < 30; i++) {
    let x = xsum;
    let y = 0;
    let xCount = int(random(5, 20));
    let yCount = 350;
    let R = 4;
    let xSpan = R + random(2, 5);
    let ySpan = R + random(3);

    FF_rect(x, y, xCount, yCount, xSpan, ySpan, R);
    xsum += xCount * xSpan;
  }

  // 使用迴圈重複繪製
  for (let i = 0; i < 50; i++) {
    let x = random(-padding, width);
    let y = random(-padding, height);
    let xCount = int(random(5, 20));
    let yCount = int(random(20, 200));
    let R = 4;
    let xSpan = R + random(2, 5);
    let ySpan = R + random(3);
    FF_rect(x, y, xCount, yCount, xSpan, ySpan, R);
  }

  // // 格子狀的
  // let ysum = 0;
  // let xsum = 0;
  // let yCount = 50;

  // for (let j = 0; j < 80; j++) {
  //   let xCount = random(10) * 5;

  //   let x = xsum;
  //   let y = ysum;
  //   let R = 4;
  //   let xSpan = R * 2;
  //   let ySpan = R * 2;

  //   FF_rect(x, y, xCount, yCount, xSpan, ySpan, R);

  //   xsum += xCount * xSpan;
  //   if (xsum > width) {
  //     ysum += yCount * ySpan;
  //     yCount = random([10, 30, 60]);
  //     xsum = 0;
  //   }
  await sleep(10);

  // 只畫一次
  noLoop();
}

function draw() {}

// _x: 起始x座標, _y: 起始y座標, _xCount: x方向點點排數, _yCount: y方向點點排數, _xSpan: x方向間距, _ySpan: y方向間距, _R: 點點大小
async function FF_rect(_x, _y, _xCount, _yCount, _xSpan, _ySpan, _R) {
  let mainClr = random(color_palette); // 隨機選一個顏色

  let mainHue = hue(mainClr);
  let mainSat = saturation(mainClr);
  let mainBri = brightness(mainClr);

  let lightClr = color(mainHue, mainSat - 10, mainBri + 30); // 將當前顏色調亮

  let waveDir = random(); // 0-1

  let fade_scale = random(0.8, 1); // 0-1
  await sleep(100);

  let noiseStep = 0.002; // 波型取樣距離，小->波型變化小；大->波型變化大
  let sharpness = 0.1; // 銳利取樣範圍，大->比較不銳利；銳利畫取樣範圍，小-> 邊緣銳利
  let noiseRnd = random();

  // 繪製點點矩陣
  for (let i = 0; i < _xCount; i++) {
    let px = i * _xSpan + _x; // 計算 x 座標
    let fade_rate = px / _xCount; // 0-1
    fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

    for (let j = 0; j < _yCount; j++) {
      let py = j * _ySpan + _y; // 計算 y 座標

      let distanceFromCenter = abs(j - (_yCount - 1) / 2) / (_yCount / 2);
      let fade_rate = map(distanceFromCenter, 0, 1, 0, fade_scale);

      // let fade_rate = j / _yCount; // 0-1
      // fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

      if (random() > fade_rate) {
        push(); // 儲存畫布目前狀態
        translate(px, py); // 移動畫布原點

        if (waveDir > 0.2) {
          // ... 後續原本繪製點點的 code ...
          fill(abs(sin(px / 30)) < 0.1 ? lightClr : mainClr); // 畫出亮色線條
        } else {
          fill(abs(sin(py / 30)) < 0.1 ? lightClr : mainClr); // 畫出亮色線條
        }

        // 繪製 noise 生鏽
        if (noiseRnd < 0.5) {
          let off = noise(px * noiseStep, py * noiseStep);

          let offStroke = constrain(
            map(off, 0.5 - sharpness, 0.5 + sharpness, 0, 1) * _R * 2,
            0,
            _R * 2,
          );

          stroke("#945031");

          noFill();
          strokeWeight(2);
          circle(0, 0, offStroke);
        }

        noStroke(); // 不要外框線
        let r = _R * random(0.6, 1);

        // 1. 設定方形從中心點 (0,0) 開始向外繪製
        rectMode(CENTER);

        // 2. 畫方形，邊長給 r * 2（這樣視覺大小才會跟原本的圓形直徑一樣大）
        // 寫法效果
        rotate(random(TWO_PI));
        square(0, 0, r * 2, 1);

        // // 用線條繪製 XX 材質
        // if (random() < 0.05) {
        //     noFill();
        //     stroke(mainClr);
        //     strokeWeight(2);
        //     line(-r, -r, r, r);
        //     line(-r, r, r, -r);
        // }

        // 用弧線繪製毛茸茸材質
        if (random() < 0.01) {
          noFill();
          stroke(random(color_palette)); // 隨機跳色
          strokeWeight(2);
          push();
          rotate(random(TWO_PI));
          let arcW = r * 2 * random(0.8, 2);
          let arcH = r * 2 * random(0.8, 2);
          arc(-random(r), random(r), arcW, arcH, 0, PI * 1.5);
          pop();
        }
        // 用線條繪製 菱形 材質
        if (random() < 0.05) {
          noFill();
          stroke(mainClr);
          strokeWeight(2);

          // 畫出菱形：分別是上方、右方、下方、左方的頂點
          quad(0, -r, r, 0, 0, r, -r, 0);
        }

        // 用線條繪製 十字星形 材質
        if (random() < 0.05) {
          noFill();
          stroke(mainClr);
          strokeWeight(2);

          let innerR = r * 0.3; // 內凹處的半徑，數字越小星星越尖（0.3 很剛好）

          beginShape();
          vertex(0, -r); // 上外頂點
          vertex(innerR, -innerR); // 右上內凹點

          vertex(r, 0); // 右外頂點
          vertex(innerR, innerR); // 右下內凹點

          vertex(0, r); // 下外頂點
          vertex(-innerR, innerR); // 左下內凹點

          vertex(-r, 0); // 左外頂點
          vertex(-innerR, -innerR); // 左上內凹點
          endShape(CLOSE);
        }

        pop(); // 回復至畫布先前狀態
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
