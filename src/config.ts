import dotenv from "dotenv";

dotenv.config();

const documentId = process.env["DOCUMENT_ID"];

if (!documentId) {
  throw Error("Document id is not provided, terminating");
}

const client_email = process.env["GOOGLE_CLIENT_EMAIL"];

if (!client_email) {
  throw Error("Client email not provided, terminating");
}

const private_key = process.env["GOOGLE_PRIVATE_KEY"];

if (!client_email || !private_key) {
  throw Error("Google private key not provided, terminating");
}

const config = {
  client_email,
  private_key,
  documentId,
} as const;

export default config;
