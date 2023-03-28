using System.ComponentModel.DataAnnotations;

namespace NotesAPI.Models.Entities
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(50, ErrorMessage = "Title cannot exceed 50 characters")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Description is required")]
        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }
        [Display(Name = "Visible")]
        public bool IsVisible { get; set; }
    }
}
