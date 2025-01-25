import { ApiPromise, SubmittableExtrinsic } from "@autonomys/auto-utils";
import { compactAddLength } from "@polkadot/util";
import { AsnParser, AsnSerializer } from "@peculiar/asn1-schema";
import { Certificate } from "@peculiar/asn1-x509";
import { X509Certificate } from "@peculiar/x509";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier as AsnAlgorithmIdentifier } from "@peculiar/asn1-x509";
import type { ISubmittableResult } from "@polkadot/types/types";

export const derEncodeSignatureAlgorithmOID = (
  oid: string,
  parameters: ArrayBuffer | null = null
): Uint8Array => {
  // Create an instance of AlgorithmIdentifier with proper handling of parameters
  const algorithmIdentifier = new AsnAlgorithmIdentifier({
    algorithm: oid,
    parameters: parameters
      ? AsnConvert.serialize(new OctetString(parameters))
      : null,
  });

  // Convert the entire AlgorithmIdentifier to DER
  const derEncoded = AsnConvert.serialize(algorithmIdentifier);

  // Return the resulting DER-encoded data
  return new Uint8Array(derEncoded);
};

export const convertX509CertToDerEncodedComponents = (
  certificate: X509Certificate
): [Uint8Array, Uint8Array] => {
  const certificateBuffer = Buffer.from(certificate.rawData);
  const cert = AsnParser.parse(certificateBuffer, Certificate);
  const signatureAlgorithmOID = cert.signatureAlgorithm.algorithm;
  const derEncodedOID = derEncodeSignatureAlgorithmOID(signatureAlgorithmOID);
  const tbsCertificate = cert.tbsCertificate;
  const tbsCertificateDerVec = new Uint8Array(
    AsnSerializer.serialize(tbsCertificate)
  );
  return [derEncodedOID, tbsCertificateDerVec];
};

export const registerAutoId = (
  api: ApiPromise,
  certificate: X509Certificate,
  issuerId?: string
): SubmittableExtrinsic<"promise", ISubmittableResult> => {
  const [derEncodedOID, tbsCertificateDerVec] =
    convertX509CertToDerEncodedComponents(certificate);

  const baseCertificate = {
    certificate: compactAddLength(tbsCertificateDerVec),
    signature_algorithm: compactAddLength(derEncodedOID),
    signature: compactAddLength(new Uint8Array(certificate.signature)),
  };

  const certificateParam = issuerId
    ? { Leaf: { issuer_id: issuerId, ...baseCertificate } }
    : { Root: baseCertificate };

  const req = { X509: certificateParam };

  return api.tx.autoId.registerAutoId(req);
};
