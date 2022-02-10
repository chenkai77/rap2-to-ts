/* 
 * @{Name}
 * @{Description}
 */
export function @{InterfaceName}(data: @{RequestType}):Promise<@{ResponseType}> {
  return @{RequestKeyword}({
    url: "@{InterfaceUrl}",
    method: "@{InterfaceMethod}",
    @{QueryParam},
  })
}