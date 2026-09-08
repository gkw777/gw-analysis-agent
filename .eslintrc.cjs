module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // 'prettier' 는 반드시 맨 마지막. 앞선 config 들의 포맷 관련 규칙을 꺼서
    // Prettier 와 충돌하지 않게 한다. 포맷은 Prettier 가, 코드 품질은 ESLint 가 담당.
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
  parser: '@typescript-eslint/parser', // 타입스크립트 파서를 사용하도록 설정
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'no-relative-import-paths'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      // 타입 검사는 tsc 가 담당한다. eslint 코어의 no-undef 는 TS 의 import/타입을
      // 인식하지 못해 오탐만 내므로 TS 파일에서는 끈다.
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    // General rules
    'no-unused-vars': 'off',

    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Custom rules
    // 같은 폴더(./Foo)는 상대경로 허용, 상위 폴더(../)는 '@/...' 절대경로로.
    // 'warn' 인 이유: 이 규칙에는 fixer 가 있어서 저장하는 순간(codeActionsOnSave)
    // 자동으로 절대경로로 바뀐다. 빨간 에러로 띄우면 맥락을 모르는 팀원이 당황하므로
    // 경고 수준이면 충분하다. 자동 변환 자체는 이 규칙이 담당하므로 제거하면 안 된다.
    // rootDir 은 eslint 실행 cwd(= frontend) 기준이라 'src' 로 둔다.
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      {
        allowSameFolder: true,
        rootDir: 'src',
        prefix: '@',
      },
    ],
  },
};
