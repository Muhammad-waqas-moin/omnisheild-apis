import { NextResponse } from "next/server";

const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;
const projectId = "bridge-438615";
const location = "us"; // Format is 'us' or 'eu'
const processorId = "8752d0adb33a04f3";
function removeTrailingNewline(str) {
  return str.replace(/\n+$/, "");
}
let i = 0;

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*", // For testing purposes, allows all domains
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Get route in next app router
export async function GET(request) {
  console.log(request, " hey");

  return NextResponse.json(
    { message: "Hollaa, Nextu.js with App Router!" },
    {
      headers: {
        "Access-Control-Allow-Origin": "*", // This allows access from any origin
      },
    }
  );
}
/**
 * Handles POST requests to the route.
 *
 * @param {import("next/server").NextRequest} request
 * @returns {import("next/server").NextResponse}
 */

export async function POST(request) {
  // get rquest body
  const body = await request.json();
  const { base64Image } = body;

  // Calculate the image size
  const imageBuffer = Buffer.from(base64Image, "base64");
  const imageSizeInMB = imageBuffer.length / (1024 * 1024); // Convert bytes to MB
  const MAX_IMAGE_SIZE_MB = 20; // Set your size limit here

  // Check if the image size exceeds the limit
  if (imageSizeInMB > MAX_IMAGE_SIZE_MB) {
    return NextResponse.json(
      { error: `Image size exceeds the limit of ${MAX_IMAGE_SIZE_MB} MB.` },
      { status: 400 } // Bad request
    );
  }

  const client = new DocumentProcessorServiceClient({
    // keyFilename: ,
    credentials: {
      type: "service_account",
      project_id: "bridge-438615",
      private_key_id: "47036bdb846f8d16997fc98ea5e438ad0ad473f7",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCphgmhp8B5jXql\n5ZLOyyJARzPJtbXu4QVXVN3hTZCi9SASWn60n5IpNMDGOUQgHyEnMlJ+14b+Fx6V\noZtnYZ6yv2ROwI780UIXKBBwNvOpGteSbqC84MwQWA+Eo9NP4Ra1WwxGCUiBr7TF\n2qIVlFUennJ3HH+sqxa/PeHy9xhSzbrqdp57f7ildU0GXB9522pe23YphHLlGuQJ\ns/lMOD2pPimpPJ2apZ+wyVbif2Flw799GQiXsRYDYsUwwumQVHXxJvaPjiUR1GYZ\nKNOIosZsSwksTcyT0k9ykffsvpdEeIGEAKTXwFkbUx4kUZ2smW1uOmfBWhDfIg+Q\nsLmL8NVJAgMBAAECggEABBdBdT60lNpWqtky5T2eqnltZQE3Djgs5lIcdprmEiCj\nMP4xD4/IOalVu5LXM4U8yhLbTcdKsSgCq262btS6vSqEM6hO6wfrtd5YIzUYRSzq\nJdT4mQY9tmlBmpxPdZ6Da0Xysl/3+XUxghLIFYg6U55UOc6cwCBy0JOgN7pBwoG9\nYoZTDRKYoX6MPJT74dhaeO5+y8m4d6UwhsmJ5LZsHLwTQxtitC2rn/JlWENSM8FY\n+IcjlUXs8m9bui5yVWyo8IH+7F1+l/pXeHduqMgS0V4FmAKeE55AJJOhTZu1X+9e\nzm+yGxrEPthc68rJ2i8DBVcfB44rnG60wPE2sjS39wKBgQDRb/US+l8nYgNWmQZb\nL+xoLv6cNWDIkH7Dj7A6gSjoqn581x77N8EghkPv7RvbefeyRL+RM3kLsVFb2xsF\nWAFHqYaROA1dfiJSKFEU4vWbFnJCDVVhH9uzQLEsCEHk9LSXsxWUqN1cYxIOrVGN\nK2crosjQEq2FHn3n3J/VC9n4QwKBgQDPNme20lzpoXazT28a/61mLXCadEIOTtaI\n4zh8d1I2nmeeD5pjFYnMrwJ7VCNEBucMMCg9SzVVc5thejXucFVjWLboPM66Ohwx\nbraz2R0rGiRg0BrNq8GODxzKEsfOxxsfggFlCUWsFu52eJXFuXf9lvlsg9OcaJzX\nOqrkG9LZgwKBgQCv/oTTDdIoJhToEG9m8T6XzeXnHnPWFpZvf693elIGMj9YaO1/\n7bo8upccZwOhyzx6cYsJWVe+m6LirZxnQSzSK4MJRTD1/6iXoYmBI7eAO7yIBOxa\nUYstdo9rkQTOgVPAppzb74sUt6vU6ZA+MNrhsElPkGKAGr9yt9MYFH12QQKBgGtU\nSOBfkhTJt4wlRu17JbvZKYw3T8fNej4pQ6bkv0bfQdiTSGquS1QkCmsLJ8EiuiaM\nAyvMevGqEf+pp6m7sd7losgkRwga9WN9b1E00nDy94jWAiwqHPWSSl044Rnv89Kc\nKlDFPrtmnVnsF9f0u3w06TkWB1Pqs+Kf1siUyOA1AoGAXJCg8EA/x6hPfbJaUkj3\ntjNR77+ZtdOPgv3B4l26HsNFLhN5dBtHGXXd1O3J6vdEBBpe2xFCDlDhKUYZ+IpR\nu7Ywm07ZhYa27UdQ64cCWoDs/JLZx53R7Gb7JG/EQc1eg+zITzLAnx1sKRj+4HLa\nM/iRUQEBDswNUNPgRKfPPlU=\n-----END PRIVATE KEY-----\n",
      client_email:
        "document-ai-service-account@bridge-438615.iam.gserviceaccount.com",
      client_id: "106981861116265792714",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/document-ai-service-account%40bridge-438615.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    },
  });

  let formFields = {}; // Initialize an empty object

  async function processDocument() {
    // The full resource name of the processor, e.g.:
    // projects/project-id/locations/location/processor/processor-id
    // You must create new processors in the Cloud Console first
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    // Read the file into memory.
    // const imageFile = await fs.readFile(filePath);

    // Convert the image data to a Buffer and base64 encode it.
    // const encodedImage = Buffer.from(imageFile).toString("base64");

    const request = {
      name,
      rawDocument: {
        content: base64Image,
        // content: encodedImage,
        mimeType: "image/jpeg",
      },
    };

    // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);

    const { document } = result;
    const { text } = document;

    for (const page of document.pages) {
      console.log(`\n\n**** Page ${page.pageNumber} ****`);

      console.log(`Found ${page.formFields.length} form field(s):`);
      for (const field of page.formFields) {
        ++i;
        if (field.fieldName?.textAnchor && field.fieldValue?.textAnchor) {
          const fieldName = getText(field.fieldName?.textAnchor, text);
          const fieldValue = getText(field.fieldValue?.textAnchor, text);
          formFields[
            removeTrailingNewline(
              removeTrailingNewline(fieldName) in formFields
                ? fieldName + 2
                : fieldName
            )
          ] = removeTrailingNewline(fieldValue);
          console.log(
            `\t* ${JSON.stringify(fieldName)}: ${JSON.stringify(fieldValue)}`
          );
        }
      }
    }
  }
  // Extract shards from the text field
  const getText = (textAnchor, text) => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return "";
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };
  // return res.json({ message: "doc-ai app", resul });

  await processDocument();

  return NextResponse.json(formFields, {
    headers: {
      "Access-Control-Allow-Origin": "*", // This allows access from any origin
    },
  });
}
