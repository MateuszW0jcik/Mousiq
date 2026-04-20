package org.example.productservice.common.resolver;

import com.mousiq.common.annotation.CurrentUserId;
import com.mousiq.common.exception.BadRequestException;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.UUID;

@Component
public class CurrentUserIdArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUserId.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        String userId = webRequest.getHeader("X-User-Id");

        if (userId == null) {
            throw new BadRequestException("Missing X-User-Id header");
        }

        try {
            if (parameter.getParameterType().equals(UUID.class)) {
                return UUID.fromString(userId);
            }
            return userId;
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid user ID format");
        }
    }
}
