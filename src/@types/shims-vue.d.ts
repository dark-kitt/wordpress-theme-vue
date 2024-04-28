// General Vue 3 declarations
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
// Assets declarations
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.svg?raw' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

// global const's
declare const TOKEN_DATA: {
  token: string;
  user: string;
  role: string;
};
