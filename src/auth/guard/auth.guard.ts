import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): Promise<boolean> | Observable<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      return false;
    }

    const [_, token] = authHeader.split(" ");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
