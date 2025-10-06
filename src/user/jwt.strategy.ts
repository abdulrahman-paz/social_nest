import { Injectable, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        const jwtSecret = configService.get<string>("JWT_SECRET");
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in configuration");
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    console.log('Cookie token:', req?.cookies?.access_token);   
                    return req?.cookies?.access_token || null;
                }
            ]),
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub, username: payload.username
        }
    }
}
