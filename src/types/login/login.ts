export type SubmitLoginResponse = {
  access_token: string;
  authorizes: string | null;
  avatar: string | null;
  code: string;
  departmentCode: string;
  departmentRole: string;
  email: string;
  expires_in: number;
  isCustomer: boolean;
  isStaff: boolean;
  jti: string;
  name: string;
  refresh_token: string;
  roles: string[];
  scope: string;
  tenant: string;
  token_type: string;
  username: string;
};

export type Department = {
  accountNo: number;
  ancestorsCodes: string[]; // Hoặc có thể định nghĩa cụ thể hơn nếu cần
  childrenNo: number;
  code: string;
  createdBy: string;
  createdByCustomer: boolean;
  createdDate: string;
  description: string | null;
  descriptionTranslations: Record<string, string>; // Hoặc có thể định nghĩa cụ thể hơn nếu cần
  employeeNo: number;
  id: string;
  lastModifiedBy: string;
  lastModifiedByCustomer: boolean;
  lastModifiedDate: string;
  level: number;
  modes: string[]; // Hoặc có thể định nghĩa cụ thể hơn nếu cần
  name: string;
  nameTranslations: Record<string, string>; // Hoặc có thể định nghĩa cụ thể hơn nếu cần
  orderNo: number;
  parent: string | null;
  parentCode: string;
  system: boolean;
  timekeeper: string | null;
  titleCodes: string[]; // Hoặc có thể định nghĩa cụ thể hơn nếu cần
  titleNo: number;
};

export type Result = {
  address: string | null;
  addressText: string | null;
  allowLoginCMS: boolean;
  ancestorsDepartmentCode: string[];
  authorizes: string[] | null;
  avatar: string | null;
  bankUser: string | null;
  basicSalary: number | null;
  birthDay: string | null;
  cccd: string | null;
  changePassword: boolean;
  checkinCode: string | null;
  createdBy: string;
  createdByCms: boolean;
  createdDate: string;
  dateLeave: string | null;
  degrees: string[];
  department: Department;
  departmentCode: string;
  departmentModes: string[];
  departmentRole: string;
  dependentPersons: string | null;
  email: string;
  employeeNormal: boolean;
  employeeWorkShift: boolean;
  enabled: boolean;
  firstName: string | null;
  fullName: string;
  gender: string | null;
  historyChangeDepartmentAndTitles: string[];
  historyChangeSalaries: string[];
  historyLaborContracts: string[] | null;
  imageCCCD: string | null;
  issueDateCCCD: string | null;
  issuePlaceCCCD: string | null;
  laborContract: string | null;
  lastModifiedBy: string;
  lastModifiedDate: string;
  lastName: string | null;
  leaveEmployeeInfo: string | null;
  link: string | null;
  listRole: string[] | null;
  maritalStatus: boolean;
  middleName: string | null;
  national: string | null;
  otherName: string | null;
  phone: string | null;
  placeBirth: string | null;
  roles: string[];
  salary: number | null;
  salaryInHour: number | null;
  salaryWorkShift: number | null;
  scopeDepartmentAndTitles: string[];
  scopeSalaries: string[];
  staff: boolean;
  startSalary: string | null;
  startWork: string | null;
  status: string | null;
  taxAndInsurance: string | null;
  telegramUser: string | null;
  title: string | null;
  titleCode: string;
  typeMoney: string | null;
  username: string;
  viewTaxAndInsurance: boolean;
};

export type EmployeeDetailResponse = {
  code: number | null;
  count: number;
  error: boolean;
  message: string | null;
  result: Result;
  showMessage: boolean;
};
