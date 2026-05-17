import { Company } from '../company/company.interface';
import { User } from '../user/user.interface';
import { IBusinessSuggestion } from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';

export interface BusinessSuggestionVote {
  status?: boolean;
  user?: User;
  company?: Company;
  businessSuggestion: IBusinessSuggestion;
}
