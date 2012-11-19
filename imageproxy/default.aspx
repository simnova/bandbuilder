<%@ Page Language="C#" %>
<%




var backgroundUrl = Request.QueryString["url"];
            var request = System.Net.WebRequest.Create(backgroundUrl);
            var response = request.GetResponse();
            var stream = response.GetResponseStream();
            var image = System.Drawing.Image.FromStream(stream);
Response.ContentType = "image/jpeg";
image.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);

%>