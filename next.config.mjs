// /** @type {import('next').NextConfig} */
// const nextConfig = {

// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // Adjust the size limit as needed
    },
  },
};

export default nextConfig;
