import { Branch } from "src/app/pages/system-users/models";

export default function getBranchName(branches: Branch[],code: string){  
        let target = branches.filter((branch) => branch.branchCode === code);
        let targetName = target[0].branchName;
        return targetName;
}