export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (error.code !== "ERR_MODULE_NOT_FOUND" || !isRelativeSpecifier(specifier) || hasExtension(specifier)) {
      throw error;
    }

    return nextResolve(`${specifier}.ts`, context);
  }
}

function isRelativeSpecifier(specifier) {
  return specifier.startsWith("./") || specifier.startsWith("../");
}

function hasExtension(specifier) {
  return /\.[cm]?[jt]sx?$/.test(specifier);
}
