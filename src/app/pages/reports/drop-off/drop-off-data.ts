export interface Dropoff {
  idNo: string;
  name: string;
  personalInfo: boolean;
  idUpload: boolean;
  selfie: boolean;
  iprs: boolean;
  kra: boolean;
  compliance: boolean;
  recognition: boolean;
}

export const DROPOFF_DATA: Dropoff[] = [
  {
    idNo: "C092",
    name: "Jason Lynch",
    personalInfo: true,
    idUpload: false,
    selfie: true,
    iprs: true,
    kra: false,
    compliance: true,
    recognition: false,
  },
  {
    idNo: "C093",
    name: "Jessica Brown",
    personalInfo: true,
    idUpload: true,
    selfie: true,
    iprs: false,
    kra: false,
    compliance: true,
    recognition: true,
  },
  {
    idNo: "C094",
    name: "Rachel Butler",
    personalInfo: true,
    idUpload: false,
    selfie: false,
    iprs: true,
    kra: true,
    compliance: false,
    recognition: false,
  },
  {
    idNo: "C095",
    name: "Tamara Garcia",
    personalInfo: false,
    idUpload: false,
    selfie: false,
    iprs: false,
    kra: false,
    compliance: false,
    recognition: false,
  },
  {
    idNo: "C096",
    name: "William Elliott",
    personalInfo: true,
    idUpload: true,
    selfie: false,
    iprs: true,
    kra: false,
    compliance: false,
    recognition: true,
  },
  {
    idNo: "C097",
    name: "Danielle Carrillo",
    personalInfo: true,
    idUpload: true,
    selfie: true,
    iprs: true,
    kra: true,
    compliance: true,
    recognition: false,
  },
  {
    idNo: "C098",
    name: "Ana Rice",
    personalInfo: true,
    idUpload: false,
    selfie: false,
    iprs: false,
    kra: true,
    compliance: false,
    recognition: true,
  },
  {
    idNo: "C099",
    name: "Cynthia Guerra",
    personalInfo: false,
    idUpload: true,
    selfie: true,
    iprs: false,
    kra: false,
    compliance: true,
    recognition: false,
  },
  {
    idNo: "C100",
    name: "Laura Martinez",
    personalInfo: true,
    idUpload: true,
    selfie: false,
    iprs: true,
    kra: false,
    compliance: true,
    recognition: true,
  },
];
