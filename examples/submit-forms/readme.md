
# 异步表单提交

这里有两个异步提交表单的演示, *form-data.html* 利用 `FormData` 异步提交表单, 不兼容低版本IE.
*compatible-upload.html* 兼容IE8的异步提交表单.

后端代码是C#的, 如下: 

    public ActionResult CampatibleSubmitForms()
    {
        var fileCount = Request.Files.Count;
        if (fileCount < 1) return Json(new { success = false, msg = "no file" }, "text/plain");
    
        var firstName = Request.Params["firstName"];
        var lastName = Request.Params["lastName"];
        var birthday = Request.Params["birthday"];
        var fileName = Request.Files[0].FileName;
        var fileSize = Request.Files[0].ContentLength;
    
        return Json(new
        {
            firstName,
            lastName,
            birthday,
            fileName,
            fileCount,
            fileSize
        }, "text/plain");
    } 

**注意网页里的jQuery引用正确**
