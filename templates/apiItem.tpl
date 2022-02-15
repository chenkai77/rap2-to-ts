/* 
 * @{Name}
 * @{Description}
 */
export function @{InterfaceName}(@{DataQuery}):@{Promise}<@{ResponseType}> {
  return @{RequestKeyword}({
    url: "@{InterfaceUrl}",
    method: "@{InterfaceMethod}",
    @{QueryParam}
  })
}