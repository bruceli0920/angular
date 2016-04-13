export function normalizeValidator(validator) {
    if (validator.validate !== undefined) {
        return (c) => validator.validate(c);
    }
    else {
        return validator;
    }
}
export function normalizeAsyncValidator(validator) {
    if (validator.validate !== undefined) {
        return (c) => Promise.resolve(validator.validate(c));
    }
    else {
        return validator;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXplX3ZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgteG5PdGVwZnUudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvZGlyZWN0aXZlcy9ub3JtYWxpemVfdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbIm5vcm1hbGl6ZVZhbGlkYXRvciIsIm5vcm1hbGl6ZUFzeW5jVmFsaWRhdG9yIl0sIm1hcHBpbmdzIjoiQUFHQSxtQ0FBbUMsU0FBa0M7SUFDbkVBLEVBQUVBLENBQUNBLENBQWFBLFNBQVVBLENBQUNBLFFBQVFBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2xEQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFrQkEsS0FBaUJBLFNBQVVBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ3BFQSxDQUFDQTtJQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNOQSxNQUFNQSxDQUFjQSxTQUFTQSxDQUFDQTtJQUNoQ0EsQ0FBQ0E7QUFDSEEsQ0FBQ0E7QUFFRCx3Q0FBd0MsU0FBdUM7SUFDN0VDLEVBQUVBLENBQUNBLENBQWFBLFNBQVVBLENBQUNBLFFBQVFBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2xEQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFrQkEsS0FBS0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBYUEsU0FBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDckZBLENBQUNBO0lBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ05BLE1BQU1BLENBQW1CQSxTQUFTQSxDQUFDQTtJQUNyQ0EsQ0FBQ0E7QUFDSEEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Fic3RyYWN0Q29udHJvbH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQge1ZhbGlkYXRvciwgVmFsaWRhdG9yRm4sIEFzeW5jVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVWYWxpZGF0b3IodmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvcik6IFZhbGlkYXRvckZuIHtcbiAgaWYgKCg8VmFsaWRhdG9yPnZhbGlkYXRvcikudmFsaWRhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiAoPFZhbGlkYXRvcj52YWxpZGF0b3IpLnZhbGlkYXRlKGMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiA8VmFsaWRhdG9yRm4+dmFsaWRhdG9yO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBc3luY1ZhbGlkYXRvcih2YWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3IpOiBBc3luY1ZhbGlkYXRvckZuIHtcbiAgaWYgKCg8VmFsaWRhdG9yPnZhbGlkYXRvcikudmFsaWRhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiBQcm9taXNlLnJlc29sdmUoKDxWYWxpZGF0b3I+dmFsaWRhdG9yKS52YWxpZGF0ZShjKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDxBc3luY1ZhbGlkYXRvckZuPnZhbGlkYXRvcjtcbiAgfVxufVxuIl19