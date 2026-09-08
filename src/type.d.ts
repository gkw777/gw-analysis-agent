/// <reference types="vite-plugin-svgr/client" />

// svg 파일을 React 컴포넌트로 import 할 수 있게 해주는 타입 정의
declare module '*.svg?react' {
  import React = require('react');
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

// svg 파일을 문자열로 import 할 수 있게 해주는 타입 정의
declare module '*.svg' {
  const content: string;
  export default content;
}
