import { SetMetadata } from '@nestjs/common';
import { ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../enum/route-policies.enum';

// aqui é pego pelo metadata a politica da rota pelo decorator proprio ja tipado para facil adesão
export const SetRoutePolicy = (policy: RoutePolicies) => {
  return SetMetadata(ROUTE_POLICY_KEY, policy);
};
