import { isBlank } from 'angular2/src/facade/lang';
import { splitNsName } from './html_tags';
const NG_CONTENT_SELECT_ATTR = 'select';
const NG_CONTENT_ELEMENT = 'ng-content';
const LINK_ELEMENT = 'link';
const LINK_STYLE_REL_ATTR = 'rel';
const LINK_STYLE_HREF_ATTR = 'href';
const LINK_STYLE_REL_VALUE = 'stylesheet';
const STYLE_ELEMENT = 'style';
const SCRIPT_ELEMENT = 'script';
const NG_NON_BINDABLE_ATTR = 'ngNonBindable';
const NG_PROJECT_AS = 'ngProjectAs';
export function preparseElement(ast) {
    var selectAttr = null;
    var hrefAttr = null;
    var relAttr = null;
    var nonBindable = false;
    var projectAs = null;
    ast.attrs.forEach(attr => {
        let lcAttrName = attr.name.toLowerCase();
        if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
            selectAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
            hrefAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_REL_ATTR) {
            relAttr = attr.value;
        }
        else if (attr.name == NG_NON_BINDABLE_ATTR) {
            nonBindable = true;
        }
        else if (attr.name == NG_PROJECT_AS) {
            if (attr.value.length > 0) {
                projectAs = attr.value;
            }
        }
    });
    selectAttr = normalizeNgContentSelect(selectAttr);
    var nodeName = ast.name.toLowerCase();
    var type = PreparsedElementType.OTHER;
    if (splitNsName(nodeName)[1] == NG_CONTENT_ELEMENT) {
        type = PreparsedElementType.NG_CONTENT;
    }
    else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
    }
    else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
    }
    else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
    }
    return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
}
export var PreparsedElementType;
(function (PreparsedElementType) {
    PreparsedElementType[PreparsedElementType["NG_CONTENT"] = 0] = "NG_CONTENT";
    PreparsedElementType[PreparsedElementType["STYLE"] = 1] = "STYLE";
    PreparsedElementType[PreparsedElementType["STYLESHEET"] = 2] = "STYLESHEET";
    PreparsedElementType[PreparsedElementType["SCRIPT"] = 3] = "SCRIPT";
    PreparsedElementType[PreparsedElementType["OTHER"] = 4] = "OTHER";
})(PreparsedElementType || (PreparsedElementType = {}));
export class PreparsedElement {
    constructor(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
    }
}
function normalizeNgContentSelect(selectAttr) {
    if (isBlank(selectAttr) || selectAttr.length === 0) {
        return '*';
    }
    return selectAttr;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcHJlcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC0zZTZPUXJ0aC50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3RlbXBsYXRlX3ByZXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxFQUFDLE9BQU8sRUFBWSxNQUFNLDBCQUEwQjtPQUNwRCxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWE7QUFFdkMsTUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUM7QUFDeEMsTUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUM7QUFDeEMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzVCLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLE1BQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQzFDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUM5QixNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUM7QUFDaEMsTUFBTSxvQkFBb0IsR0FBRyxlQUFlLENBQUM7QUFDN0MsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBRXBDLGdDQUFnQyxHQUFtQjtJQUNqRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDdEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztJQUNuQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDeEIsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDO0lBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUk7UUFDcEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lB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QUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SHRtbEVsZW1lbnRBc3R9IGZyb20gJy4vaHRtbF9hc3QnO1xuaW1wb3J0IHtpc0JsYW5rLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3NwbGl0TnNOYW1lfSBmcm9tICcuL2h0bWxfdGFncyc7XG5cbmNvbnN0IE5HX0NPTlRFTlRfU0VMRUNUX0FUVFIgPSAnc2VsZWN0JztcbmNvbnN0IE5HX0NPTlRFTlRfRUxFTUVOVCA9ICduZy1jb250ZW50JztcbmNvbnN0IExJTktfRUxFTUVOVCA9ICdsaW5rJztcbmNvbnN0IExJTktfU1RZTEVfUkVMX0FUVFIgPSAncmVsJztcbmNvbnN0IExJTktfU1RZTEVfSFJFRl9BVFRSID0gJ2hyZWYnO1xuY29uc3QgTElOS19TVFlMRV9SRUxfVkFMVUUgPSAnc3R5bGVzaGVldCc7XG5jb25zdCBTVFlMRV9FTEVNRU5UID0gJ3N0eWxlJztcbmNvbnN0IFNDUklQVF9FTEVNRU5UID0gJ3NjcmlwdCc7XG5jb25zdCBOR19OT05fQklOREFCTEVfQVRUUiA9ICduZ05vbkJpbmRhYmxlJztcbmNvbnN0IE5HX1BST0pFQ1RfQVMgPSAnbmdQcm9qZWN0QXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyc2VFbGVtZW50KGFzdDogSHRtbEVsZW1lbnRBc3QpOiBQcmVwYXJzZWRFbGVtZW50IHtcbiAgdmFyIHNlbGVjdEF0dHIgPSBudWxsO1xuICB2YXIgaHJlZkF0dHIgPSBudWxsO1xuICB2YXIgcmVsQXR0ciA9IG51bGw7XG4gIHZhciBub25CaW5kYWJsZSA9IGZhbHNlO1xuICB2YXIgcHJvamVjdEFzOiBzdHJpbmcgPSBudWxsO1xuICBhc3QuYXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICBsZXQgbGNBdHRyTmFtZSA9IGF0dHIubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChsY0F0dHJOYW1lID09IE5HX0NPTlRFTlRfU0VMRUNUX0FUVFIpIHtcbiAgICAgIHNlbGVjdEF0dHIgPSBhdHRyLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAobGNBdHRyTmFtZSA9PSBMSU5LX1NUWUxFX0hSRUZfQVRUUikge1xuICAgICAgaHJlZkF0dHIgPSBhdHRyLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAobGNBdHRyTmFtZSA9PSBMSU5LX1NUWUxFX1JFTF9BVFRSKSB7XG4gICAgICByZWxBdHRyID0gYXR0ci52YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGF0dHIubmFtZSA9PSBOR19OT05fQklOREFCTEVfQVRUUikge1xuICAgICAgbm9uQmluZGFibGUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoYXR0ci5uYW1lID09IE5HX1BST0pFQ1RfQVMpIHtcbiAgICAgIGlmIChhdHRyLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHJvamVjdEFzID0gYXR0ci52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBzZWxlY3RBdHRyID0gbm9ybWFsaXplTmdDb250ZW50U2VsZWN0KHNlbGVjdEF0dHIpO1xuICB2YXIgbm9kZU5hbWUgPSBhc3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICB2YXIgdHlwZSA9IFByZXBhcnNlZEVsZW1lbnRUeXBlLk9USEVSO1xuICBpZiAoc3BsaXROc05hbWUobm9kZU5hbWUpWzFdID09IE5HX0NPTlRFTlRfRUxFTUVOVCkge1xuICAgIHR5cGUgPSBQcmVwYXJzZWRFbGVtZW50VHlwZS5OR19DT05URU5UO1xuICB9IGVsc2UgaWYgKG5vZGVOYW1lID09IFNUWUxFX0VMRU1FTlQpIHtcbiAgICB0eXBlID0gUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEU7XG4gIH0gZWxzZSBpZiAobm9kZU5hbWUgPT0gU0NSSVBUX0VMRU1FTlQpIHtcbiAgICB0eXBlID0gUHJlcGFyc2VkRWxlbWVudFR5cGUuU0NSSVBUO1xuICB9IGVsc2UgaWYgKG5vZGVOYW1lID09IExJTktfRUxFTUVOVCAmJiByZWxBdHRyID09IExJTktfU1RZTEVfUkVMX1ZBTFVFKSB7XG4gICAgdHlwZSA9IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNUWUxFU0hFRVQ7XG4gIH1cbiAgcmV0dXJuIG5ldyBQcmVwYXJzZWRFbGVtZW50KHR5cGUsIHNlbGVjdEF0dHIsIGhyZWZBdHRyLCBub25CaW5kYWJsZSwgcHJvamVjdEFzKTtcbn1cblxuZXhwb3J0IGVudW0gUHJlcGFyc2VkRWxlbWVudFR5cGUge1xuICBOR19DT05URU5ULFxuICBTVFlMRSxcbiAgU1RZTEVTSEVFVCxcbiAgU0NSSVBULFxuICBPVEhFUlxufVxuXG5leHBvcnQgY2xhc3MgUHJlcGFyc2VkRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBQcmVwYXJzZWRFbGVtZW50VHlwZSwgcHVibGljIHNlbGVjdEF0dHI6IHN0cmluZywgcHVibGljIGhyZWZBdHRyOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBub25CaW5kYWJsZTogYm9vbGVhbiwgcHVibGljIHByb2plY3RBczogc3RyaW5nKSB7fVxufVxuXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5nQ29udGVudFNlbGVjdChzZWxlY3RBdHRyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaXNCbGFuayhzZWxlY3RBdHRyKSB8fCBzZWxlY3RBdHRyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAnKic7XG4gIH1cbiAgcmV0dXJuIHNlbGVjdEF0dHI7XG59XG4iXX0=