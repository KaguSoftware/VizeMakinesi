// Cookie-free client for use in generateStaticParams (build time).
// Same client as the public read path — kept under its original name so
// existing build-time callers read clearly.
export { createPublicClient as createStaticClient } from './public';
