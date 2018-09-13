(function($) {
    $(function() {
        CKEDITOR.replace("EditAnnContent");
        $(".delete").click(function(e) {
            e.preventDefault();
            var $data = $(this).data("id");
            swal({
                title: "確定要刪除嗎?",
                text: "刪除後將無法復原",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "我確定!",
                cancelButtonColor: '#868e96',
                cancelButtonText: "我按錯了!",
            }).then(function() {
                swal({
                    title: "刪除中",
                    text: "正在刪除，請靜候片刻",
                    type: "info",
                    showConfirmButton: false,
                    allowEnterKey: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).catch(swal.noop);
                $.ajax({
                    url: '/admin/ann/remove',
                    type: 'POST',
                    data: { id: $data },
                    cache: false
                }).done(function() {
                    swal("成功刪除", "此消息已於最新消息中完整移除", "success").then(function() {
                        location.reload();
                    });
                }).fail(function() {
                    swal('送出失敗！', '請聯絡網站製作者', 'error').catch(swal.noop);
                });
            });
        });
        $(".edit").click(function(e) {
            e.preventDefault();
            var $root = $(this).parent().parent();
            console.log("%c"+$root.find(".annContent").text().trim(), 'background: #222; color:#bada55;');
            CKEDITOR.instances.EditAnnContent.setData($root.find(".annContent").text().trim());
            $("#EditAnnTitle").val($root.find(".annTitle").text().trim());
            $("#EditAnnDate").val($root.find(".annDate").text().trim());
            $("input[name=id]").val($root.find(".modify i").first().data("id"));
            console.log($("input[name=id]").val());
            if ($root.find(".annAttachment").text().trim() === '') {
                $("input[name=removeFile]").val("true");
                $("#oriFileName").hide();
                $("#removeFile").hide();
                $("#EditAnnFile").show();
            } else {
                $("input[name=removeFile]").val("false");
                $("#oriFileName").text($root.find(".annAttachment").text().trim());
                $("#oriFileName").attr("href", $root.find(".annAttachment").children().first().attr("href"));
                $("#oriFileName").attr("download", $root.find(".annAttachment").text().trim());
                $("#oriFileName").show();
                $("#removeFile").show();
                $("#EditAnnFile").hide();
            }
            $("#editPanel").modal("show");
        });
        $("#removeFile").click(function() {
            $("input[name=removeFile]").val(true);
            $("#oriFileName").hide();
            $("#removeFile").hide();
            $("#EditAnnFile").show();
        });
        $("#submitAnn").click(function(e) {
            e.preventDefault();
            $("#editPanel").modal("hide");
            swal({
                title: "修改中",
                text: "正在修改，若是上傳檔案較大可能需花稍久之時間，請靜候片刻",
                type: "info",
                showConfirmButton: false,
                allowEnterKey: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).catch(swal.noop);
            var content = CKEDITOR.instances.EditAnnContent.getData();
            $("#EditAnnContent").val(content);
            var $form = $("#EditAnn");
            var formdata = false;
            if (window.FormData) formdata = new FormData($form[0]);
            else formdata = $form.serialize();
            $.ajax({
                url: '/admin/ann/update',
                type: 'POST',
                data: formdata ? formdata : form.serialize(),
                cache: false,
                contentType: false,
                processData: false
            }).done(function() {
                swal("更新成功", "已於網站中更新最新消息", "success").then(function() {
                    location.reload();
                });
            }).fail(function() {
                swal('送出失敗！', '請聯絡網站製作者', 'error').catch(swal.noop);
            });
        });
    });
})(jQuery);
